# PDF 页面重新排列功能实现计划

## 一、功能概述

用户上传一个 PDF 文件后，系统解析并展示该 PDF 的所有页面缩略图。用户可以通过 **拖拽排序** 或选择系统提供的自动排列模式，对页面顺序进行调整，并生成新的 PDF 文件。

系统通过调用 Stirling-PDF 的 `/api/v1/general/rearrange-pages` 接口完成页面重新排列。

## 二、功能目标

- ✅ 支持可视化页面预览
- ✅ 支持拖拽排序（核心功能）
- ✅ 支持自动排列模式
- ✅ 支持批量页面处理模式
- ✅ 生成新的 PDF 文件，不覆盖原文件

## 三、技术架构

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **UI 库**: React + TailwindCSS
- **PDF 处理**: PDF.js (用于渲染缩略图)
- **拖拽排序**: @dnd-kit/core + @dnd-kit/sortable
- **文件上传**: react-dropzone
- **HTTP 客户端**: Axios

### 后端技术栈
- **框架**: NestJS
- **PDF 处理**: Stirling-PDF API
- **文件管理**: 临时文件存储和清理

## 四、实现步骤

### 阶段一：后端 API 集成（预计 2 小时）

#### 1.1 更新 Stirling-PDF 接口定义
**文件**: `backend/src/modules/stirling-pdf/stirling-pdf.interface.ts`

添加重新排列页面的接口定义：
```typescript
export type RearrangeMode = 
  | 'CUSTOM'
  | 'REVERSE_ORDER'
  | 'DUPLICATE'
  | 'DUPLEX_SORT'
  | 'BOOKLET_SORT'
  | 'ODD_EVEN_SPLIT'
  | 'ODD_EVEN_MERGE'
  | 'REMOVE_FIRST'
  | 'REMOVE_LAST'
  | 'REMOVE_FIRST_AND_LAST';

export interface RearrangePagesOptions {
  /** 页面顺序表达式（必填）
   * CUSTOM 模式: 拖拽后的顺序，如 "3,1,2,5,4"
   * REVERSE_ORDER 模式: 可传 "all"
   * DUPLICATE 模式: 倍数，如 "4"
   * 其他模式: 可传 "all"
   */
  pageNumbers: string;
  /** 排列模式 */
  customMode: RearrangeMode;
}
```

#### 1.2 实现重新排列服务方法
**文件**: `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`

添加 `rearrangePages` 方法：
```typescript
async rearrangePages(
  pdfBuffer: Buffer,
  filename: string,
  options: RearrangePagesOptions,
): Promise<Buffer> {
  this.logger.log(`Rearranging PDF: ${filename}, mode: ${options.customMode}, pages: ${options.pageNumbers}`);
  
  const fields: Record<string, string | Buffer> = {
    fileInput: pdfBuffer,
    pageNumbers: options.pageNumbers,
    customMode: options.customMode,
  };

  return this.makeMultipartRequest('/api/v1/general/rearrange-pages', fields, filename);
}
```

#### 1.3 添加转换控制器端点
**文件**: `backend/src/modules/conversion/conversion.controller.ts`

添加重新排列端点：
```typescript
@Post('rearrange-pages')
@UseInterceptors(FileInterceptor('file'))
async rearrangePages(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: { pageNumbers: string; customMode: string },
  @Req() req: Request,
) {
  const ipAddress = req.ip || req.socket.remoteAddress || '';
  const options: RearrangePagesOptions = {
    pageNumbers: body.pageNumbers,
    customMode: body.customMode as RearrangeMode,
  };
  
  return this.conversionService.createRearrangePagesConversion(file, options, ipAddress);
}
```

#### 1.4 实现转换服务
**文件**: `backend/src/modules/conversion/conversion.service.ts`

添加重新排列逻辑：
```typescript
async createRearrangePagesConversion(
  file: Express.Multer.File,
  options: RearrangePagesOptions,
  ipAddress: string,
) {
  // 验证文件
  if (!file) {
    throw new BadRequestException('请上传 PDF 文件');
  }
  if (file.size > this.maxFileSize) {
    throw new BadRequestException(`文件大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`);
  }
  if (file.mimetype !== 'application/pdf') {
    throw new BadRequestException('只支持 PDF 文件');
  }

  // 准备任务信息
  const taskId = uuidv4();
  const normalizedOriginalName = this.normalizeOriginalName(file.originalname);
  const expireMinutes = parseInt(this.configService.get('FILE_EXPIRE_MINUTES') || '30', 10);
  const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
  const outputPath = path.join(this.uploadDir, `${taskId}.pdf`);

  // 执行重新排列
  const outputBuffer = await this.stirlingPdfService.rearrangePages(
    file.buffer,
    normalizedOriginalName,
    options,
  );

  // 保存输出文件
  fs.writeFileSync(outputPath, outputBuffer);

  // 创建数据库记录
  const task = this.taskRepository.create({
    id: taskId,
    originalName: normalizedOriginalName,
    inputPath: '',
    type: ConversionType.REARRANGE_PAGES,
    status: TaskStatus.COMPLETED,
    fileSize: file.size,
    ipAddress,
    expiresAt,
    outputPath,
  });

  await this.taskRepository.save(task);

  return {
    taskId,
    status: TaskStatus.COMPLETED,
    message: '页面重新排列完成',
  };
}
```

#### 1.5 更新数据库实体
**文件**: `backend/src/modules/task/task.entity.ts`

添加新的转换类型：
```typescript
export enum ConversionType {
  // ... 其他类型
  REARRANGE_PAGES = 'rearrange-pages',
}

export const OUTPUT_EXTENSIONS: Record<ConversionType, string> = {
  // ... 其他类型
  [ConversionType.REARRANGE_PAGES]: '.pdf',
};
```

#### 1.6 更新上传服务文件名生成
**文件**: `backend/src/modules/upload/upload.service.ts`

添加重新排列类型的文件名处理：
```typescript
case 'rearrange-pages':
  return `${baseName}_rearranged.pdf`;
```

### 阶段二：前端组件开发（预计 4 小时）

#### 2.1 安装拖拽库
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

#### 2.2 创建重新排列页面路由
**目录**: `frontend/src/app/rearrange-pdf/`

创建文件：
- `page.tsx` - 服务端组件，页面元数据
- `client-page.tsx` - 客户端组件，主要交互逻辑

#### 2.3 开发拖拽排序组件
**文件**: `frontend/src/components/rearrange-pdf/SortableThumbnail.tsx`

实现可拖拽的页面缩略图组件：
- 使用 @dnd-kit 实现拖拽功能
- 显示页面缩略图和页码
- 拖拽手柄图标
- 拖拽时的动画效果

#### 2.4 开发模式选择组件
**文件**: `frontend/src/components/rearrange-pdf/ModeSelector.tsx`

实现排列模式选择下拉框：
- CUSTOM（默认）
- REVERSE_ORDER
- DUPLICATE
- DUPLEX_SORT
- BOOKLET_SORT
- ODD_EVEN_SPLIT
- ODD_EVEN_MERGE
- REMOVE_FIRST
- REMOVE_LAST
- REMOVE_FIRST_AND_LAST

#### 2.5 开发页面预览网格
**文件**: `frontend/src/components/rearrange-pdf/PageGrid.tsx`

实现页面缩略图网格：
- 网格布局展示所有页面
- 支持拖拽排序
- 大文件分页加载
- 加载进度条

### 阶段三：页面逻辑整合（预计 2 小时）

#### 3.1 实现主页面逻辑
**文件**: `frontend/src/app/rearrange-pdf/client-page.tsx`

主要功能：
1. 文件上传处理
2. PDF 页数解析和缩略图渲染
3. 拖拽排序状态管理
4. 模式选择和 pageNumbers 生成
5. API 调用
6. 结果处理和下载
7. 错误处理

#### 3.2 状态管理
使用 React useState 管理以下状态：
```typescript
const [file, setFile] = useState<File | null>(null);
const [pageCount, setPageCount] = useState(0);
const [pageOrder, setPageOrder] = useState<number[]>([]);
const [pageThumbnails, setPageThumbnails] = useState<HTMLCanvasElement[]>([]);
const [mode, setMode] = useState<RearrangeMode>('CUSTOM');
const [duplicateCount, setDuplicateCount] = useState(2);
const [taskId, setTaskId] = useState<string | null>(null);
const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
const [isProcessing, setIsProcessing] = useState(false);
const [loadingProgress, setLoadingProgress] = useState(0);
```

### 阶段四：测试和优化（预计 2 小时）

#### 4.1 功能测试
- 拖拽排序测试
- 各种自动排列模式测试
- 大文件性能测试（>100 页）
- 下载功能测试

#### 4.2 边界条件测试
- 空文件处理
- 单页 PDF 处理
- 网络错误处理
- 文件过大处理

#### 4.3 性能优化
- 大文件懒加载（>50 页）
- 缩略图渲染优化
- 分页加载（>200 页）
- 拖拽性能优化

## 五、API 接口设计

### 5.1 前端调用接口
```
POST /api/v1/general/rearrange-pages
Content-Type: multipart/form-data

Parameters:
- fileInput: PDF 文件（binary）
- pageNumbers: 页面顺序表达式（string）
  格式示例:
  - "3,1,2,5,4" - CUSTOM 模式，拖拽后的顺序
  - "all" - REVERSE_ORDER 等自动模式
  - "4" - DUPLICATE 模式，每页复制 4 次
- customMode: 排列模式（string）
  可选值: CUSTOM, REVERSE_ORDER, DUPLICATE, DUPLEX_SORT, 
         BOOKLET_SORT, ODD_EVEN_SPLIT, ODD_EVEN_MERGE,
         REMOVE_FIRST, REMOVE_LAST, REMOVE_FIRST_AND_LAST
```

### 5.2 返回格式
Stirling-PDF 返回重新排列后的 PDF 文件。

### 5.3 文件命名规则
```
原文件名：document.pdf
重新排列后：document_rearranged.pdf
```

## 六、用户交互流程

### 完整流程
1. **上传阶段**
   - 用户进入"PDF 页面排序"页面
   - 拖拽或点击上传 PDF 文件
   - 显示文件名、大小、总页数
   - 自动解析 PDF 页面并显示加载进度

2. **排序阶段**
   - 展示所有页面缩略图（网格布局）
   - 用户可以选择：
     - **拖拽排序**：手动调整页面顺序
     - **自动模式**：选择预设的排列模式
   - 实时预览排序后的效果

3. **确认阶段**
   - 显示最终的页面顺序
   - 用户确认生成新文件

4. **处理阶段**
   - 显示处理进度
   - 调用后端 API
   - 等待 Stirling-PDF 处理

5. **下载阶段**
   - 处理完成，显示结果
   - 提供下载按钮
   - 支持重新上传

## 七、错误处理策略

### 前端错误
| 错误场景 | 处理方式 |
|---------|---------|
| 未上传文件 | 禁用生成按钮 |
| 页码不合法 | 400 错误提示 |
| 文件过大 | 上传前检查，提示最大限制 |
| 网络异常 | 显示重试按钮 |
| 拖拽失败 | 回滚到原始顺序 |

### 后端错误
| 错误场景 | HTTP 状态码 | 处理方式 |
|---------|-----------|---------|
| 参数错误 | 400 | 返回详细错误信息 |
| 文件损坏 | 400 | 提示文件无法解析 |
| Stirling-PDF 不可用 | 503 | 提示服务暂时不可用 |
| 处理失败 | 500 | 记录日志，返回友好提示 |
| 限流 | 429 | 提示今日次数已用完 |

## 八、性能优化方案

### 8.1 缩略图渲染优化
- 使用 Intersection Observer 实现懒加载
- 只渲染可见区域的缩略图
- 超过 50 页启用分页

### 8.2 大文件处理
- 超过 200 页分页展示
- 显示加载进度条
- 支持取消操作

### 8.3 拖拽性能
- 使用 @dnd-kit 的虚拟化功能
- 拖拽时使用占位符，减少重渲染
- 拖拽完成后批量更新状态

## 九、SEO 优化

### 页面元数据
```typescript
export const metadata = {
  title: 'PDF 页面排序 - 免费在线 PDF 重新排列工具',
  description: '免费在线 PDF 页面排序工具，支持拖拽排序、自动排列模式。可视化调整 PDF 页面顺序，快速生成新的 PDF 文件。',
  keywords: 'PDF 排序，PDF 页面排序，PDF 重新排列，PDF 工具，在线 PDF',
};
```

## 十、交付清单

### 后端交付
- [ ] `stirling-pdf.interface.ts` - 添加 RearrangePagesOptions
- [ ] `stirling-pdf.service.ts` - 添加 rearrangePages 方法
- [ ] `conversion.controller.ts` - 添加 rearrange-pages 端点
- [ ] `conversion.service.ts` - 添加重新排列逻辑
- [ ] `task.entity.ts` - 添加 REARRANGE_PAGES 类型
- [ ] `upload.service.ts` - 添加文件名处理

### 前端交付
- [ ] `frontend/src/app/rearrange-pdf/page.tsx` - 页面路由
- [ ] `frontend/src/app/rearrange-pdf/client-page.tsx` - 主逻辑
- [ ] `frontend/src/components/rearrange-pdf/SortableThumbnail.tsx` - 可拖拽缩略图
- [ ] `frontend/src/components/rearrange-pdf/ModeSelector.tsx` - 模式选择器
- [ ] `frontend/src/components/rearrange-pdf/PageGrid.tsx` - 页面网格
- [ ] 更新导航菜单添加排序入口

### 文档交付
- [ ] README.md 更新
- [ ] API 文档更新
- [ ] 使用说明文档

## 十一、风险评估

### 技术风险
1. **Stirling-PDF API 可用性**
   - 应对：提前测试 API，准备降级方案

2. **大文件拖拽性能**
   - 应对：实现虚拟化，限制同时渲染的页面数

3. **浏览器兼容性**
   - 应对：使用 @dnd-kit 保证兼容性，测试主流浏览器

### 进度风险
- 拖拽组件开发复杂度较高
- 预留足够的测试时间
- 分阶段交付，先完成核心功能

## 十二、预计开发时间

- 后端集成：2 小时
- 前端组件：4 小时
- 页面整合：2 小时
- 测试优化：2 小时
- **总计：10-12 小时**
