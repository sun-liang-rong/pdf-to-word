# PDF转Word项目重构计划

## 背景
当前项目存在冗余代码：前端上传文件后，后端先存储文件，再通过队列机制由Worker处理转换，最后再存储转换后的文件。实际上当前代码已经在ConversionService中直接调用Stirling-PDF转换，但仍有残留的队列机制代码。

## 目标
简化流程：前端上传 → 直接发送给Stirling-PDF转换 → 保存转换后文件供下载

## 详细步骤

### 1. 简化ConversionService
- 移除对QueueService的依赖
- 移除inputPath存储逻辑（已不存储原始文件）
- 保留直接调用StirlingPdfService的同步转换逻辑

### 2. 删除Worker相关代码（不再需要）
- 删除 `backend/src/worker/main.ts`
- 删除 `backend/src/worker/worker.module.ts`
- 删除 `backend/src/worker/worker.service.ts`

### 3. 清理模块引用
- 从 `conversion.module.ts` 移除 QueueModule 导入
- 从 `app.module.ts` 移除可能存在的Worker相关引用

### 4. 保留的必要功能
- 数据库任务记录（记录转换任务信息）
- 文件清理服务（定期清理过期文件）
- 限流服务（保护API）

### 5. 文件删除清单
- `backend/src/worker/main.ts`
- `backend/src/worker/worker.module.ts`
- `backend/src/worker/worker.service.ts`

### 6. 修改文件清单
- `backend/src/modules/conversion/conversion.module.ts` - 移除QueueModule
- `backend/src/modules/conversion/conversion.service.ts` - 移除QueueService依赖
- `backend/src/app.module.ts` - 确保模块引用正确

## 预期结果
- 流程更简洁：上传 → 转换 → 下载
- 代码量减少，移除冗余的Worker和队列处理代码
- 保留数据库记录用于追踪任务
