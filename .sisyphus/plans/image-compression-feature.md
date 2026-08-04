# 在线图片压缩工具 - 实施计划

## TL;DR
> **Summary**: 实现一个完整的在线图片压缩平台，支持单张和批量压缩，格式转换，质量控制
> **Deliverables**: 
>   - NestJS 后端模块 (sharp 图片处理)
>   - Next.js 前端页面 (上传/预览/压缩/下载)
>   - 文件存储与安全验证
> **Effort**: Medium
> **Parallel**: YES - 前后端可并行开发
> **Critical Path**: 后端模块 → 前端页面 → 集成测试

## Context
### Original Request
用户要求实现一个在线图片压缩工具，规格如下：
- 前端: Next.js (App Router) - 上传、预览、参数设置、结果展示
- 后端: NestJS + sharp - 单张/批量压缩 API
- 存储: 本地 /uploads 目录
- 安全: MIME 校验、大小限制、禁止 SVG

### Technical Approach
采用与现有 PDF 功能类似的架构：
- 后端使用 NestJS 模块化结构
- 前端使用 React 组件 + API 调用
- 文件使用本地存储（时间戳+uuid命名）

## Work Objectives
### Core Objective
实现完整的图片压缩功能，支持：
1. 单张图片压缩
2. 批量图片压缩
3. 格式转换 (JPG/PNG/WEBP)
4. 质量控制 (0-100)
5. 宽高 resize

### Deliverables
- [ ] 后端: image.module.ts - 图片模块
- [ ] 后端: image.service.ts - 压缩服务 (sharp)
- [ ] 后端: image.controller.ts - API 控制器
- [ ] 前端: image-compress/page.tsx - 压缩页面
- [ ] 前端: components - 上传/预览组件
- [ ] 安全: 文件验证中间件

### Definition of Done (verifiable conditions with commands)
- [ ] POST /api/v1/image/compress 返回正确的压缩结果
- [ ] POST /api/v1/image/compress/batch 支持批量压缩
- [ ] 前端页面可上传并预览图片
- [ ] 压缩前后大小对比正确显示
- [ ] 文件安全校验生效

## Execution Strategy
### Parallel Execution Waves
Wave 1: 后端模块搭建 (依赖 sharp 安装)
Wave 2: 前端页面开发
Wave 3: 集成测试

## TODOs

### Wave 1: 后端模块

- [ ] 1. 添加 sharp 依赖到 backend/package.json

  **What to do**: 
  在 dependencies 中添加 "sharp": "^0.33.0"

  **References**:
  - Pattern: 现有模块 package.json
  - External: https://sharp.pixelplumbing.com/

  **Acceptance Criteria**:
  - [ ] sharp 依赖已添加

- [ ] 2. 创建 image.interface.ts - 类型定义

  **What to do**: 
  创建图片压缩相关接口：CompressImageOptions, CompressImageResult, ALLOWED_IMAGE_MIME_TYPES, MAX_FILE_SIZE 等

  **References**:
  - Pattern: stirling-pdf.interface.ts

  **Acceptance Criteria**:
  - [ ] 接口定义完整

- [ ] 3. 创建 image.service.ts - 图片压缩服务

  **What to do**: 
  实现 compressImage 方法，使用 sharp 进行图片压缩：
  ```typescript
  await sharp(file.buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .toFormat(format || 'jpeg', { quality: quality || 80 })
    .toBuffer();
  ```

  **References**:
  - Pattern: stirling-pdf.service.ts - 服务层模式
  - External: https://sharp.pixelplumbing.com/

  **Acceptance Criteria**:
  - [ ] 单张压缩功能正常
  - [ ] 格式转换功能正常
  - [ ] 质量控制功能正常

- [ ] 4. 创建 image.controller.ts - API 控制器

  **What to do**: 
  实现两个 API:
  - POST /api/v1/image/compress - 单张压缩
  - POST /api/v1/image/compress/batch - 批量压缩

  **References**:
  - Pattern: watermark.controller.ts

  **Acceptance Criteria**:
  - [ ] 单张压缩 API 正常
  - [ ] 批量压缩 API 正常

- [ ] 5. 创建 image.module.ts - NestJS 模块

  **What to do**: 
  注册 ImageModule，包含 Multer 配置

  **References**:
  - Pattern: watermark.module.ts

  **Acceptance Criteria**:
  - [ ] 模块正确注册

- [ ] 6. 更新 app.module.ts - 导入 ImageModule

  **What to do**: 
  在根模块中导入 ImageModule

  **References**:
  - Pattern: 现有模块导入

  **Acceptance Criteria**:
  - [ ] ImageModule 已导入

### Wave 2: 前端页面

- [ ] 7. 创建图片压缩页面 frontend/src/app/image-compress/page.tsx

  **What to do**: 
  创建完整的图片压缩页面，包含：
  - 文件上传区域（点击/拖拽）
  - 压缩参数设置面板
  - 压缩结果展示
  - 下载按钮

  **References**:
  - Pattern: watermark-pdf/client-page.tsx

  **Acceptance Criteria**:
  - [ ] 上传功能正常
  - [ ] 参数设置正常
  - [ ] 结果展示正常
  - [ ] 下载功能正常

- [ ] 8. 添加路由和导航

  **What to do**: 
  在 Header 中添加图片压缩导航链接

  **References**:
  - Pattern: 现有导航结构

  **Acceptance Criteria**:
  - [ ] 导航链接可用

### Wave 3: 安全与存储

- [ ] 9. 文件安全验证

  **What to do**: 
  实现：
  - MIME 类型校验
  - 扩展名校验
  - 文件大小限制 (20MB)
  - 禁止 SVG 上传

  **References**:
  - Pattern: 现有验证逻辑

  **Acceptance Criteria**:
  - [ ] 无效文件被拒绝
  - [ ] 超大文件被拒绝
  - [ ] SVG 被拒绝

- [ ] 10. 文件存储策略

  **What to do**: 
  实现：
  - 时间戳+uuid 文件命名
  - /uploads 目录存储

  **References**:
  - Pattern: 现有上传逻辑

  **Acceptance Criteria**:
  - [ ] 文件正确保存
  - [ ] 命名规则正确

## Final Verification Wave
- [ ] F1. 单张压缩功能测试
- [ ] F2. 批量压缩功能测试
- [ ] F3. 格式转换测试
- [ ] F4. 前端页面功能测试

## Success Criteria
1. 后端 API 可正常处理图片压缩请求
2. 前端页面可完整展示上传→压缩→下载流程
3. 所有安全校验正常工作
4. 压缩率计算正确
