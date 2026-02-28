# PDF合并功能实现计划

## 功能概述
实现PDF合并功能，用户可上传多个PDF文件，通过拖拽排序、配置选项，最终生成合并后的PDF文件。

---

## 一、后端实现

### 1.1 更新类型定义
**文件**: `backend/src/modules/task/task.entity.ts`
- 添加 `ConversionType.MERGE_PDF` 枚举值
- 添加 `OUTPUT_EXTENSIONS[ConversionType.MERGE_PDF] = '.pdf'`

### 1.2 添加合并接口定义
**文件**: `backend/src/modules/stirling-pdf/stirling-pdf.interface.ts`
- 新增 `MergePdfOptions` 接口，包含：
  - `sortType`: 排序类型
  - `removeCertSign`: 是否去除证书签名
  - `generateToc`: 是否生成目录
  - `clientFileIds`: 文件唯一标识数组

### 1.3 实现合并服务方法
**文件**: `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`
- 新增 `mergePdfs` 方法
- 调用 Stirling-PDF `/api/v1/general/merge-pdfs` 接口
- 支持多文件上传（FormData 多个 fileInput 字段）
- 添加参数验证

### 1.4 更新转换服务
**文件**: `backend/src/modules/conversion/conversion.service.ts`
- 添加 `MERGE_PDF` 到 `ALLOWED_TYPES`
- 新增 `createMergeConversion` 方法处理多文件合并
- 支持接收多个文件和合并选项

### 1.5 更新控制器
**文件**: `backend/src/modules/conversion/conversion.controller.ts`
- 新增 `@Post('merge')` 接口
- 使用 `FileFieldsInterceptor` 接收多文件
- 接收合并选项参数

### 1.6 更新工具列表
- 在 `getSupportedTools` 中添加 PDF 合并工具信息

---

## 二、前端实现

### 2.1 创建页面路由
**新建目录**: `frontend/src/app/merge-pdf/`
- `page.tsx`: 页面元数据和SEO
- `client-page.tsx`: 客户端交互组件

### 2.2 创建多文件上传组件
**新建文件**: `frontend/src/components/upload/MultiFileUploader.tsx`
- 支持多文件拖拽上传
- 仅允许 PDF 文件
- 显示文件列表（文件名、大小）
- 支持拖拽排序
- 支持删除单个文件
- 生成 clientFileIds

### 2.3 创建合并选项组件
**新建文件**: `frontend/src/components/merge/MergeOptions.tsx`
- 排序方式下拉选择
- 去除证书签名复选框
- 生成目录复选框

### 2.4 创建合并页面主组件
**文件**: `frontend/src/app/merge-pdf/client-page.tsx`
- 集成多文件上传组件
- 集成合并选项组件
- 显示合并进度
- 提供下载功能
- 错误处理和提示

### 2.5 更新首页工具列表
**文件**: `frontend/src/app/page.tsx`
- 添加 PDF 合并工具卡片

### 2.6 更新 sitemap
**文件**: `frontend/src/app/sitemap.ts`
- 添加 `/merge-pdf` 路由

---

## 三、实现步骤

### 步骤 1: 后端类型定义
1. 更新 `task.entity.ts` 添加 `MERGE_PDF` 枚举
2. 更新 `stirling-pdf.interface.ts` 添加 `MergePdfOptions` 接口

### 步骤 2: 后端服务实现
1. 在 `stirling-pdf.service.ts` 实现 `mergePdfs` 方法
2. 在 `conversion.service.ts` 添加合并逻辑
3. 在 `conversion.controller.ts` 添加合并接口

### 步骤 3: 前端组件开发
1. 创建 `MultiFileUploader` 组件
2. 创建 `MergeOptions` 组件
3. 创建合并页面

### 步骤 4: 集成测试
1. 更新首页工具列表
2. 更新 sitemap
3. 编译验证

---

## 四、API 设计

### 合并接口
```
POST /api/convert/merge

Request:
- files[]: PDF文件数组
- sortType: 排序类型 (optional)
- removeCertSign: 是否去除证书签名 (optional)
- generateToc: 是否生成目录 (optional)
- clientFileIds: 文件ID数组 (optional)

Response:
{
  "taskId": "uuid",
  "status": "completed",
  "message": "合并完成"
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
1. `frontend/src/app/merge-pdf/page.tsx`
2. `frontend/src/app/merge-pdf/client-page.tsx`
3. `frontend/src/components/upload/MultiFileUploader.tsx`
4. `frontend/src/components/merge/MergeOptions.tsx`
