# PDF 页面拆分功能实现计划

## 一、功能概述

基于现有的 PDF 删除页面功能，新增 PDF 页面拆分功能。用户上传 PDF 文件后，可以选择一个或多个页面范围，将这些页面分别生成独立的 PDF 文件。系统将调用 Stirling-PDF 的 `/api/v1/general/split-pages` 接口完成拆分。

## 二、功能目标

### 核心功能
- ✅ 支持单页拆分（将指定单页生成独立 PDF）
- ✅ 支持多页拆分（将多个指定页面分别生成独立 PDF）
- ✅ 支持拆分全部页面（每一页都生成独立 PDF）
- ✅ 支持使用页码表达式拆分（如 `1,3,5`、`2-6`、`2n+1` 等）
- ✅ 输出为多个独立 PDF 文件或 ZIP 压缩包

### 用户体验目标
- ✅ 可视化页面选择（缩略图网格展示）
- ✅ 支持范围模式（类似参考图片的交互方式）
- ✅ 实时预览和确认
- ✅ 友好的错误提示和状态反馈

## 三、技术架构

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **UI 库**: React + TailwindCSS
- **PDF 处理**: PDF.js (用于渲染缩略图)
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

添加拆分页面的接口定义：
```typescript
export interface SplitPagesOptions {
  /** 要拆分的页面表达式 */
  pageNumbers: string;
  /** 拆分模式：single(每页独立) 或 ranges(按范围) */
  splitMode?: 'single' | 'ranges';
  /** 页面范围数组（当 splitMode 为 ranges 时使用） */
  ranges?: Array<{
    start: number;
    end: number;
  }>;
}
```

#### 1.2 实现拆分服务方法
**文件**: `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`

添加 `splitPages` 方法：
```typescript
async splitPages(
  pdfBuffer: Buffer,
  filename: string,
  options: SplitPagesOptions,
): Promise<Buffer> {
  this.logger.log(`Splitting PDF: ${filename}, pages: ${options.pageNumbers}`);
  
  const fields: Record<string, string | Buffer> = {
    fileInput: pdfBuffer,
    pageNumbers: options.pageNumbers,
  };

  return this.makeMultipartRequest('/api/v1/general/split-pages', fields, filename);
}
```

#### 1.3 创建转换控制器
**文件**: `backend/src/modules/conversion/conversion.controller.ts`

添加拆分端点：
```typescript
@Post('split-pages')
@UseInterceptors(FileInterceptor('file'))
async splitPages(
  @UploadedFile() file: Express.Multer.File,
  @Body('pageNumbers') pageNumbers: string,
  @Body('ranges') ranges?: string,
) {
  // 实现逻辑
}
```

#### 1.4 实现转换服务
**文件**: `backend/src/modules/conversion/conversion.service.ts`

添加拆分逻辑，处理文件上传、调用 Stirling-PDF、返回结果。

### 阶段二：前端组件开发（预计 4 小时）

#### 2.1 创建拆分页面路由
**目录**: `frontend/src/app/split-pdf/`

创建文件：
- `page.tsx` - 服务端组件，页面元数据
- `client-page.tsx` - 客户端组件，主要交互逻辑

#### 2.2 开发范围选择器组件
**文件**: `frontend/src/components/split-pdf/RangeSelector.tsx`

参考提供的 UI 图片，实现范围选择器：
- 支持添加多个范围
- 每个范围包含"从页面"和"至"两个输入框
- 支持删除范围
- 支持"合并所有范围"选项
- 支持"自定义"和"固定"模式切换

#### 2.3 复用现有组件
复用以下现有组件：
- `PDFThumbnail.tsx` - 页面缩略图渲染
- `PageSelector.tsx` - 页面选择器（需调整选择逻辑）
- `PageExpressionInput.tsx` - 页码表达式输入
- `FileUploader.tsx` - 文件上传组件
- `DownloadButton.tsx` - 下载按钮组件

#### 2.4 开发拆分结果处理
**文件**: `frontend/src/components/split-pdf/SplitResult.tsx`

处理拆分后的文件展示：
- 判断返回的是单个文件还是 ZIP
- 展示拆分后的文件列表
- 提供批量下载功能
- 支持单独下载每个文件

### 阶段三：页面逻辑整合（预计 2 小时）

#### 3.1 实现主页面逻辑
**文件**: `frontend/src/app/split-pdf/client-page.tsx`

主要功能：
1. 文件上传处理
2. PDF 页数解析
3. 范围管理（添加、删除、修改）
4. 页码表达式生成
5. API 调用
6. 结果处理
7. 错误处理

#### 3.2 状态管理
使用 React useState 管理以下状态：
```typescript
const [file, setFile] = useState<File | null>(null);
const [pageCount, setPageCount] = useState(0);
const [ranges, setRanges] = useState<Array<{ start: number; end: number }>>([]);
const [selectedMode, setSelectedMode] = useState<'custom' | 'fixed'>('custom');
const [mergeAll, setMergeAll] = useState(false);
const [taskId, setTaskId] = useState<string | null>(null);
const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
const [isProcessing, setIsProcessing] = useState(false);
```

### 阶段四：测试和优化（预计 2 小时）

#### 4.1 功能测试
- 单页拆分测试
- 多页拆分测试
- 全部页面拆分测试
- 页码表达式测试
- 范围选择器测试
- 大文件性能测试（>100 页）

#### 4.2 边界条件测试
- 空文件处理
- 无效页码处理
- 超出范围处理
- 网络错误处理
- 文件过大处理

#### 4.3 性能优化
- 大文件懒加载（>50 页）
- 缩略图渲染优化（使用 Intersection Observer）
- 分页加载（>200 页）
- 防抖处理（表达式输入）

## 五、API 接口设计

### 5.1 前端调用接口
```
POST /api/v1/general/split-pages
Content-Type: multipart/form-data

Parameters:
- fileInput: PDF 文件（binary）
- pageNumbers: 页面表达式（string）
  格式示例:
  - "1" - 拆分第 1 页
  - "1,3,5" - 拆分第 1、3、5 页
  - "2-6" - 拆分第 2 到 6 页
  - "all" - 拆分所有页面
  - "2n" - 拆分所有偶数页
  - "2n+1" - 拆分所有奇数页
```

### 5.2 返回格式
Stirling-PDF 可能返回：
1. **多个独立 PDF 文件**：每个文件为单独的响应
2. **ZIP 压缩包**：包含所有拆分后的 PDF 文件

后端需要：
- 判断返回格式
- 正确处理文件命名
- 转发给前端下载

### 5.3 文件命名规则
```
原文件名：document.pdf
拆分后：
- document_page_1.pdf
- document_page_3.pdf
- document_page_5.pdf
或
- document_split.zip
```

## 六、用户交互流程

### 完整流程
1. **上传阶段**
   - 用户进入"PDF 拆分"页面
   - 拖拽或点击上传 PDF 文件
   - 显示文件名、大小、总页数
   - 自动解析 PDF 页面

2. **选择阶段**
   - 展示所有页面缩略图（网格布局）
   - 用户选择拆分模式：
     - **自定义模式**：手动添加多个范围
     - **固定模式**：每页独立拆分
   - 添加/删除拆分范围
   - 选择是否合并所有范围

3. **确认阶段**
   - 显示将要拆分的页面列表
   - 显示预计生成的文件数量
   - 用户确认拆分

4. **处理阶段**
   - 显示处理进度
   - 调用后端 API
   - 等待 Stirling-PDF 处理

5. **下载阶段**
   - 处理完成，显示结果
   - 提供下载选项：
     - 下载全部（ZIP）
     - 单独下载每个文件
   - 支持重新上传

## 七、错误处理策略

### 前端错误
| 错误场景 | 处理方式 |
|---------|---------|
| 未选择页面 | 禁用拆分按钮，提示"请选择要拆分的页面" |
| 页码超出范围 | 输入框红色边框，显示错误提示 |
| 表达式格式错误 | 实时验证，显示格式说明 |
| 文件过大 | 上传前检查，提示最大限制 |
| 网络异常 | 显示重试按钮 |

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
```typescript
// 使用 Intersection Observer 实现懒加载
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 开始渲染可见区域的缩略图
          renderThumbnail(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  return () => observer.disconnect();
}, []);
```

### 8.2 大文件分页加载
```typescript
// 超过 200 页时分页展示
const ITEMS_PER_PAGE = 50;
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(pageCount / ITEMS_PER_PAGE);
```

### 8.3 防抖处理
```typescript
// 表达式输入防抖
useEffect(() => {
  const handler = setTimeout(() => {
    validateExpression(expression);
  }, 300);

  return () => clearTimeout(handler);
}, [expression]);
```

## 九、安全性考虑

### 文件安全
- 上传文件类型限制（仅 PDF）
- 文件大小限制（最大 20MB）
- 临时文件定期清理
- 不覆盖原文件

### API 安全
- 速率限制（防止滥用）
- 请求验证（参数校验）
- 错误日志记录
- 敏感信息不暴露

## 十、SEO 优化

### 页面元数据
```typescript
export const metadata = {
  title: 'PDF 页面拆分 - 免费在线 PDF 拆分工具',
  description: '免费在线 PDF 拆分工具，支持单页拆分、多页拆分、批量拆分。可视化选择页面，快速生成独立 PDF 文件。',
  keywords: 'PDF 拆分，PDF 页面拆分，PDF 工具，在线 PDF',
};
```

### FAQ 内容
- PDF 拆分是什么？
- 如何拆分 PDF 页面？
- 拆分后的文件格式是什么？
- 支持批量拆分吗？
- 文件安全吗？

## 十一、交付清单

### 后端交付
- [ ] `stirling-pdf.interface.ts` - 添加 SplitPagesOptions
- [ ] `stirling-pdf.service.ts` - 添加 splitPages 方法
- [ ] `conversion.controller.ts` - 添加 split-pages 端点
- [ ] `conversion.service.ts` - 添加拆分逻辑
- [ ] 单元测试文件

### 前端交付
- [ ] `frontend/src/app/split-pdf/page.tsx` - 页面路由
- [ ] `frontend/src/app/split-pdf/client-page.tsx` - 主逻辑
- [ ] `frontend/src/components/split-pdf/RangeSelector.tsx` - 范围选择器
- [ ] `frontend/src/components/split-pdf/SplitResult.tsx` - 结果展示
- [ ] 更新导航菜单添加拆分入口

### 文档交付
- [ ] README.md 更新
- [ ] API 文档更新
- [ ] 使用说明文档

## 十二、风险评估

### 技术风险
1. **Stirling-PDF API 返回格式不确定**
   - 应对：提前测试 API，准备多种返回格式处理方案

2. **大文件性能问题**
   - 应对：实现懒加载、分页、虚拟滚动

3. **中文文件名兼容性问题**
   - 应对：使用 fallback 文件名，处理特殊字符

### 进度风险
- 前端组件开发复杂度较高（范围选择器）
- 预留足够的测试时间
- 分阶段交付，先完成核心功能

## 十三、后续优化方向

### 功能增强
- 支持拖拽调整页面顺序
- 支持预览拆分后的效果
- 支持批量处理多个 PDF
- 支持保存拆分模板

### 性能优化
- 使用 Web Workers 处理 PDF 解析
- 实现更智能的懒加载
- 优化缩略图缓存策略

### 用户体验
- 添加快捷键支持
- 支持撤销/重做
- 添加拆分历史记录
- 提供拆分建议（智能识别章节）

## 十四、总结

本实现计划基于现有的 PDF 删除页面功能进行扩展，充分利用已有的组件和基础设施。通过分阶段实施，确保核心功能优先交付，然后逐步完善用户体验和性能优化。

预计总开发时间：**10-12 小时**
- 后端集成：2 小时
- 前端组件：4 小时
- 页面整合：2 小时
- 测试优化：2-4 小时
