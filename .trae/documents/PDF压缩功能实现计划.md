# PDF压缩功能实现计划

## 功能概述
实现PDF压缩功能，用户可上传单个或多个PDF文件，通过配置压缩选项（优化等级、线性化、灰度化等），生成压缩后的PDF文件。

---

## 一、后端实现

### 1.1 更新类型定义
**文件**: `backend/src/modules/task/task.entity.ts`
- 添加 `ConversionType.COMPRESS_PDF` 枚举值
- 添加 `OUTPUT_EXTENSIONS[ConversionType.COMPRESS_PDF] = '.pdf'`

### 1.2 添加压缩接口定义
**文件**: `backend/src/modules/stirling-pdf/stirling-pdf.interface.ts`
- 新增 `CompressPdfOptions` 接口，包含：
  - `optimizeLevel`: 优化等级（必填，整数）
  - `expectedOutputSize`: 期望输出大小（可选，如 '100MB'）
  - `linearize`: 是否线性化（可选）
  - `normalize`: 是否标准化（可选）
  - `grayscale`: 是否灰度化（可选）
  - `lineArt`: 是否高对比度线稿转换（可选）
  - `lineArtThreshold`: 线稿阈值（可选，0-100）
  - `lineArtEdgeLevel`: 边缘检测强度（可选，1-3）

### 1.3 实现压缩服务方法
**文件**: `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`
- 新增 `compressPdf` 方法
- 调用 Stirling-PDF `/api/v1/misc/compress-pdf` 接口
- 添加参数验证

### 1.4 更新转换服务
**文件**: `backend/src/modules/conversion/conversion.service.ts`
- 添加 `COMPRESS_PDF` 到 `ALLOWED_TYPES`
- 新增 `createCompressConversion` 方法处理压缩

### 1.5 更新控制器
**文件**: `backend/src/modules/conversion/conversion.controller.ts`
- 新增 `@Post('compress')` 接口
- 接收压缩选项参数

---

## 二、前端实现

### 2.1 创建页面路由
**新建目录**: `frontend/src/app/compress-pdf/`
- `page.tsx`: 页面元数据和SEO
- `client-page.tsx`: 客户端交互组件

### 2.2 创建压缩选项组件
**新建文件**: `frontend/src/components/compress/CompressOptions.tsx`
- 优化等级滑块/下拉选择
- 期望输出大小输入框
- 线性化复选框
- 标准化复选框
- 灰度化复选框
- 高对比度线稿复选框及参数

### 2.3 创建单文件上传组件（复用或新建）
可复用现有的 `FileUploader` 组件，或创建简化版本

### 2.4 创建压缩页面主组件
**文件**: `frontend/src/app/compress-pdf/client-page.tsx`
- 集成文件上传组件
- 集成压缩选项组件
- 显示压缩进度
- 提供下载功能
- 错误处理和提示

### 2.5 更新首页工具列表
**文件**: `frontend/src/app/page.tsx`
- 添加 PDF 压缩工具卡片

### 2.6 更新 sitemap
**文件**: `frontend/src/app/sitemap.ts`
- 添加 `/compress-pdf` 路由

---

## 三、实现步骤

### 步骤 1: 后端类型定义
1. 更新 `task.entity.ts` 添加 `COMPRESS_PDF` 枚举
2. 更新 `stirling-pdf.interface.ts` 添加 `CompressPdfOptions` 接口

### 步骤 2: 后端服务实现
1. 在 `stirling-pdf.service.ts` 实现 `compressPdf` 方法
2. 在 `conversion.service.ts` 添加压缩逻辑
3. 在 `conversion.controller.ts` 添加压缩接口

### 步骤 3: 前端组件开发
1. 创建 `CompressOptions` 组件
2. 创建压缩页面

### 步骤 4: 集成测试
1. 更新首页工具列表
2. 更新 sitemap
3. 编译验证

---

## 四、API 设计

### 压缩接口
```
POST /api/convert/compress

Request:
- file: PDF文件
- optimizeLevel: 优化等级（必填）
- expectedOutputSize: 期望输出大小（可选）
- linearize: 是否线性化（可选）
- normalize: 是否标准化（可选）
- grayscale: 是否灰度化（可选）
- lineArt: 是否线稿转换（可选）
- lineArtThreshold: 线稿阈值（可选）
- lineArtEdgeLevel: 边缘检测强度（可选）

Response:
{
  "taskId": "uuid",
  "status": "completed",
  "message": "压缩完成"
}
```

---

## 五、文件清单

### 需要修改的文件
1. `backend/src/modules/task/task.entity.ts`
2. `backend/src/modules/stirling-pdf/stirling-pdf.interface.ts`
3. `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`
4. `backend/src/modules/conversion/conversion.service.ts`
5. `backend/src/modules/conversion/conversion.controller.ts`
6. `frontend/src/app/page.tsx`
7. `frontend/src/app/sitemap.ts`

### 需要新建的文件
1. `frontend/src/app/compress-pdf/page.tsx`
2. `frontend/src/app/compress-pdf/client-page.tsx`
3. `frontend/src/components/compress/CompressOptions.tsx`
