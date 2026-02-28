# PDF指定页面删除功能实现计划

## 功能概述
用户可上传PDF文件，系统展示所有页面缩略图，用户可视化选择需要删除的页面，生成删除后的新PDF文件。

---

## 一、后端实现

### 1.1 更新类型定义
**文件**: `backend/src/modules/task/task.entity.ts`
- 添加 `ConversionType.REMOVE_PAGES` 枚举值
- 添加 `OUTPUT_EXTENSIONS[ConversionType.REMOVE_PAGES] = '.pdf'`

### 1.2 添加删除页面接口定义
**文件**: `backend/src/modules/stirling-pdf/stirling-pdf.interface.ts`
- 新增 `RemovePagesOptions` 接口，包含：
  - `pageNumbers`: 要删除的页面表达式（必填）

### 1.3 实现删除页面服务方法
**文件**: `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`
- 新增 `removePages` 方法
- 调用 Stirling-PDF `/api/v1/general/remove-pages` 接口
- 添加参数验证

### 1.4 更新转换服务
**文件**: `backend/src/modules/conversion/conversion.service.ts`
- 添加 `REMOVE_PAGES` 到 `ALLOWED_TYPES`
- 新增 `createRemovePagesConversion` 方法

### 1.5 更新控制器
**文件**: `backend/src/modules/conversion/conversion.controller.ts`
- 新增 `@Post('remove-pages')` 接口
- 接收文件和页面表达式参数

### 1.6 新增PDF预览接口
**文件**: `backend/src/modules/conversion/conversion.controller.ts`
- 新增 `@Post('preview')` 接口
- 返回PDF页面信息（页数、缩略图等）

---

## 二、前端实现

### 2.1 创建页面路由
**新建目录**: `frontend/src/app/remove-pages/`
- `page.tsx`: 页面元数据和SEO
- `client-page.tsx`: 客户端交互组件

### 2.2 创建页面选择组件
**新建文件**: `frontend/src/components/remove-pages/PageSelector.tsx`
- 网格缩略图展示
- 单页点击选择
- 全选/取消全选/反选按钮
- 选中页面视觉标识（红色边框）
- 页码显示

### 2.3 创建页面表达式输入组件
**新建文件**: `frontend/src/components/remove-pages/PageExpressionInput.tsx`
- 文本输入框
- 支持格式：`1,3,5`、`2-6`、`1,3-5,8`、`all`、`2n`、`2n+1`等
- 表达式解析和高亮对应页面
- 格式错误提示

### 2.4 创建删除页面主组件
**文件**: `frontend/src/app/remove-pages/client-page.tsx`
- 集成文件上传组件
- 上传后调用预览接口获取页面信息
- 集成页面选择组件
- 集成表达式输入组件
- 显示删除进度
- 提供下载功能
- 错误处理和提示

### 2.5 更新首页工具列表
**文件**: `frontend/src/app/page.tsx`
- 添加 PDF 删除页面工具卡片

### 2.6 更新 sitemap
**文件**: `frontend/src/app/sitemap.ts`
- 添加 `/remove-pages` 路由

---

## 三、实现步骤

### 步骤 1: 后端类型定义
1. 更新 `task.entity.ts` 添加 `REMOVE_PAGES` 枚举
2. 更新 `stirling-pdf.interface.ts` 添加 `RemovePagesOptions` 接口

### 步骤 2: 后端服务实现
1. 在 `stirling-pdf.service.ts` 实现 `removePages` 方法
2. 在 `conversion.service.ts` 添加删除页面逻辑
3. 在 `conversion.controller.ts` 添加删除页面接口
4. 添加PDF预览接口

### 步骤 3: 前端组件开发
1. 创建 `PageSelector` 组件
2. 创建 `PageExpressionInput` 组件
3. 创建删除页面主页面

### 步骤 4: 集成测试
1. 更新首页工具列表
2. 更新 sitemap
3. 编译验证

---

## 四、API 设计

### 删除页面接口
```
POST /api/convert/remove-pages

Request:
- file: PDF文件
- pageNumbers: 要删除的页面表达式

Response:
{
  "taskId": "uuid",
  "status": "completed",
  "message": "删除完成"
}
```

### PDF预览接口
```
POST /api/convert/preview

Request:
- file: PDF文件

Response:
{
  "pageCount": 10,
  "fileName": "document.pdf",
  "fileSize": 1024000
}
```

---

## 五、页面表达式格式

| 表达式 | 含义 |
|--------|------|
| `1,3,5` | 第1、3、5页 |
| `2-6` | 第2到6页 |
| `1,3-5,8` | 第1、3到5、8页 |
| `all` | 所有页面 |
| `2n` | 所有偶数页 |
| `2n+1` | 所有奇数页 |
| `3n` | 每3页一页 |
| `6n-5` | 1,7,13... |

---

## 六、用户体验优化

### 6.1 性能优化
- 大文件分页加载缩略图
- 超过100页时懒加载
- 解析时显示进度条

### 6.2 删除逻辑提示
- 删除前显示"将删除X页，生成新文件"
- 避免误删

### 6.3 边界情况处理
- 用户未选页面：禁用删除按钮
- 选择所有页面：提示不能删除全部页面
- 文件超过限制大小：提示文件过大

---

## 七、文件清单

### 需要修改的文件
1. `backend/src/modules/task/task.entity.ts`
2. `backend/src/modules/stirling-pdf/stirling-pdf.interface.ts`
3. `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`
4. `backend/src/modules/conversion/conversion.service.ts`
5. `backend/src/modules/conversion/conversion.controller.ts`
6. `frontend/src/app/page.tsx`
7. `frontend/src/app/sitemap.ts`

### 需要新建的文件
1. `frontend/src/app/remove-pages/page.tsx`
2. `frontend/src/app/remove-pages/client-page.tsx`
3. `frontend/src/components/remove-pages/PageSelector.tsx`
4. `frontend/src/components/remove-pages/PageExpressionInput.tsx`
