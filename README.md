# PDF 在线转换平台

一个现代化、快速、免费的在线PDF转换工具，支持PDF与Word、图片等多种格式互转。采用最新的技术栈构建，提供流畅的用户体验和强大的文件处理能力。

## ✨ 核心特性

### 🔄 多格式转换
- **PDF 转 Word** - 完美保留文档格式，支持DOC/DOCX输出
- **Word 转 PDF** - 保持原始排版，确保文档一致性
- **PDF 转 JPG/PNG** - 高质量图片提取，支持批量处理
- **图片转 PDF** - 多种图片格式聚合为PDF文档
- **OCR 文字识别** - 智能识别扫描件PDF中的文字内容
- **PDF 压缩** - 减小文件大小，便于传输分享
- **PDF 合并拆分** - 灵活控制页面组合与分割

### 🛡️ 安全可靠
- 完全免费使用，无需注册登录
- 文件自动清理机制（30分钟过期删除）
- IP访问限流保护（每个IP每天10次转换）
- 企业级文件类型白名单校验
- 严格的大小限制和文件名消毒处理

### 🚀 性能优势
- 基于Stirling-PDF开源引擎，转换质量优秀
- 响应式设计，完美适配桌面端和移动端
- 异步处理架构，支持大文件批量转换
- CDN加速分发，全球访问速度优化

## 🛠️ 技术栈

### 前端技术
- **Next.js 15** - 最新App Router架构，SSR + SSG支持
- **React 18** - 现代组件化开发框架
- **TailwindCSS 3.4** - 实用优先的CSS框架
- **TypeScript** - 类型安全的JavaScript超集
- **React Query** - 强大的数据获取和状态管理
- **React Dropzone** - 优雅的拖拽上传组件

### 后端技术
- **NestJS** - TypeScript编写的渐进式Node.js框架
- **TypeORM** - 功能完整的TypeScript ORM
- **MySQL 8.0** - 高性能关系型数据库
- **Docker** - 容器化部署和管理
- **PM2** - Node.js进程管理工具

### 基础设施
- **Stirling-PDF** - 开源PDF处理服务（Docker部署）
- **NGINX** - 高性能反向代理和静态文件服务

## 🚀 快速开始

### 环境要求

#### 必备软件
- **Node.js >= 18.x**
- **Docker & Docker Compose**
- **MySQL 8.0+**

#### 系统配置
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install nodejs docker.io docker-compose mysql-server

# CentOS/RHEL
sudo yum install nodejs docker docker-compose mariadb-server
```

### 一键部署

#### 1. 启动基础服务
```bash
# 启动MySQL数据库
docker-compose up -d

# 下载并启动Stirling-PDF服务
docker run -d \
  --name stirling-pdf \
  -p 8080:8080 \
  -v /path/to/data:/usr/share/tessdata \
  -e DOCKER_ENABLE_SECURITY=false \
  frooodle/s-pdf:latest
```

#### 2. 配置环境变量
```bash
# 创建后端环境配置文件
cd backend
cp .env.example .env
```

编辑 `backend/.env` 文件：
```env
# ======================
# 数据库配置
# ======================
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_secure_password
DB_DATABASE=pdf_converter

# ======================
# Stirling-PDF 配置
# ======================
STIRLING_PDF_URL=http://localhost:8080
STIRLING_PDF_TIMEOUT=300000
STIRLING_PDF_API_KEY=

# ======================
# 文件存储配置
# ======================
UPLOAD_DIR=./uploads
FILE_EXPIRY_MINUTES=30
MAX_FILE_SIZE_MB=100

# ======================
# 安全配置
# ======================
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=86400000
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png

# ======================
# 服务配置
# ======================
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

#### 3. 安装依赖
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

#### 4. 初始化数据库
```bash
cd backend
npm run migration:run
```

#### 5. 启动开发环境
```bash
# 启动后端服务（开发模式）
cd backend
npm run start:dev

# 启动前端服务
cd frontend
npm run dev
```

### 生产环境部署

#### 使用PM2守护进程
```bash
# 全局安装PM2
npm install -g pm2

# 构建项目
cd backend && npm run build
cd ../frontend && npm run build

# 启动所有服务
pm2 start ecosystem.config.js

# 查看运行状态
pm2 status

# 查看实时日志
pm2 logs pdf-to-word-backend
pm2 logs pdf-to-word-frontend

# 设置开机自启
pm2 startup
pm2 save
```

#### Docker Compose生产部署
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

## 🏗️ 项目架构

### 系统架构图
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   用户浏览器     │────>│   Next.js前端   │────>│   NestJS后端    │
│                 │     │   (Next 15)     │     │   API服务       │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                   │                     │
                                   ▼                     ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │   CDN/静态资源  │     │   MySQL数据库   │
                        │   (图片/JS/CSS) │     │   (TypeORM)     │
                        └─────────────────┘     └─────────────────┘
                                                 ▲
                                                 │
                                         ┌─────────────────┐
                                         │ Stirling-PDF    │
                                         │ 处理引擎        │
                                         └─────────────────┘
```

### 转换流程详解

| 步骤 | 操作 | 技术实现 |
|------|------|----------|
| 1 | 用户选择文件上传 | React Dropzone拖拽组件 |
| 2 | 前端验证文件类型和大小 | JavaScript + 正则表达式 |
| 3 | 调用后端API创建转换任务 | Axios HTTP请求 |
| 4 | 后端校验并转发给Stirling-PDF | NestJS控制器 |
| 5 | Stirling-PDF执行实际转换 | Docker容器处理 |
| 6 | 结果保存到本地文件系统 | Node.js fs模块 |
| 7 | 返回下载链接给前端 | RESTful API响应 |
| 8 | 用户点击下载转换后的文件 | Blob URL下载 |
| 9 | 定时任务清理过期文件 | PM2 + Cron作业 |

### 核心模块设计

#### 前端模块
```
frontend/
├── src/app/                    # App Router页面路由
│   ├── page.tsx               # 首页
│   ├── pdf-to-word/          # PDF转Word页面
│   ├── word-to-pdf/          # Word转PDF页面
│   └── api/                  # API路由
├── src/components/            # React组件
│   ├── layout/               # 布局组件
│   │   ├── Header.tsx        # 导航头部
│   │   └── Footer.tsx        # 页脚
│   ├── upload/               # 上传相关
│   │   ├── FileUploader.tsx  # 文件上传器
│   │   └── UploadZone.tsx    # 上传区域
│   └── conversion/           # 转换相关
│       ├── ConversionTemplate.tsx  # 通用模板
│       └── ProgressIndicator.tsx   # 进度指示器
└── src/lib/                  # 工具库
    ├── api.ts               # API客户端
    ├── utils.ts             # 通用工具函数
    └── constants.ts         # 常量定义
```

#### 后端模块
```
backend/
├── src/modules/              # NestJS模块
│   ├── conversion/          # 转换业务模块
│   │   ├── conversion.controller.ts
│   │   ├── conversion.service.ts
│   │   └── entities/conversion.entity.ts
│   ├── task/               # 任务管理模块
│   │   ├── task.controller.ts
│   │   ├── task.service.ts
│   │   └── entities/task.entity.ts
│   ├── upload/             # 文件服务模块
│   │   ├── upload.controller.ts
│   │   └── upload.service.ts
│   ├── rate-limit/         # IP限流模块
│   │   ├── rate-limit.guard.ts
│   │   └── rate-limit.module.ts
│   └── stirling-pdf/       # PDF处理模块
│       ├── stirling-pdf.service.ts
│       └── stirling-pdf.interface.ts
├── uploads/                # 文件存储目录
└── logs/                   # 应用日志
```

## 🔌 API 接口文档

### 基础信息
- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **认证方式**: 无（公开API）

### 转换接口

#### 创建转换任务
```http
POST /api/convert
```

**Request Body:**
```json
{
  "file": "base64_encoded_file_content",
  "fileName": "document.pdf",
  "targetFormat": "docx",
  "options": {
    "ocr": false,
    "quality": "high",
    "pageRange": null
  }
}
```

**Response:**
```json
{
  "success": true,
  "taskId": "uuid-here",
  "message": "转换任务已创建",
  "estimatedTime": "30秒"
}
```

#### 查询任务状态
```http
GET /api/task/:id
```

**Response:**
```json
{
  "success": true,
  "task": {
    "id": "uuid-here",
    "status": "processing|completed|failed",
    "progress": 75,
    "downloadUrl": "http://localhost:3000/api/download/uuid-here",
    "createdAt": "2024-01-01T00:00:00Z",
    "completedAt": "2024-01-01T00:00:30Z"
  }
}
```

#### 下载转换文件
```http
GET /api/download/:id
```

**Response:** 文件二进制流

### 工具接口

#### 获取支持的转换类型
```http
GET /api/convert/tools
```

**Response:**
```json
{
  "success": true,
  "tools": [
    {
      "id": "pdf-to-word",
      "name": "PDF 转 Word",
      "inputFormats": ["pdf"],
      "outputFormats": ["doc", "docx"],
      "maxFileSize": "100MB",
      "supportsOcr": true
    },
    {
      "id": "word-to-pdf",
      "name": "Word 转 PDF",
      "inputFormats": ["doc", "docx"],
      "outputFormats": ["pdf"],
      "maxFileSize": "100MB",
      "supportsOcr": false
    }
  ]
}
```

## 📱 移动端适配

### 响应式设计
- **桌面端**: 全功能界面，侧边栏导航
- **平板端**: 自适应布局，触控友好
- **手机端**: 单列布局，手势操作优化

### 移动端特性
- 触摸友好的上传区域
- 优化的按钮大小和间距
- 流畅的动画过渡效果
- 省流量模式（压缩图片预览）

## 🔒 安全措施

### 输入验证
- **文件类型白名单**: 仅允许指定扩展名
- **文件大小限制**: 单文件最大100MB
- **文件名消毒**: 移除特殊字符和路径遍历攻击
- **内容安全检查**: 防止恶意文件上传

### 访问控制
- **IP限流**: 每个IP地址每日最多10次转换
- **速率限制**: 防止API滥用
- **CORS配置**: 安全跨域资源共享策略

### 数据安全
- **临时存储**: 文件30分钟后自动删除
- **内存清理**: 敏感信息及时清除
- **日志脱敏**: 不记录用户文件内容

## 🧪 测试指南

### 单元测试
```bash
# 运行后端单元测试
cd backend
npm run test

# 运行前端单元测试
cd frontend
npm run test
```

### E2E测试
```bash
# 安装Playwright
npm init playwright@latest

# 运行端到端测试
npx playwright test

# 生成测试报告
npx playwright show-report
```

### 性能测试
```bash
# 使用Artillery进行负载测试
npm install -g artillery

# 运行压力测试
artillery run artillery/test-conversion.yml
```

## 🚢 部署指南

### 开发环境
```bash
# 热重载开发服务器
npm run dev

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 生产环境
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 使用PM2守护
pm2 start ecosystem.config.js --env production
```

### CI/CD流水线
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        run: |
          cd backend && npm ci && npm run build
          cd ../frontend && npm ci && npm run build
          docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 贡献指南

### 开发环境设置
1. Fork仓库并克隆到本地
2. 创建新功能分支：`git checkout -b feature/amazing-feature`
3. 安装依赖：`npm install`（前后端分别执行）
4. 启动开发服务器
5. 提交更改：`git commit -m 'Add amazing feature'`
6. 推送到分支：`git push origin feature/amazing-feature`
7. 创建Pull Request

### 代码规范
- **ESLint**: 遵循Airbnb JavaScript风格指南
- **Prettier**: 统一代码格式化
- **TypeScript**: 严格的类型检查
- **Git Commit**: 遵循Conventional Commits规范

### 提交信息格式
```
feat: 添加新功能
fix: 修复bug
docs: 文档更新
style: 代码样式修改
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 📊 监控和运维

### 日志管理
- **应用日志**: `backend/logs/` 目录
- **访问日志**: NGINX访问日志
- **错误追踪**: Sentry集成（生产环境）

### 性能指标
- **响应时间**: < 2秒（平均）
- **吞吐量**: 100+ 并发转换
- **可用性**: 99.9% uptime目标

### 健康检查
```bash
# 后端健康检查
curl http://localhost:3000/api/health

# 数据库连接检查
mysqladmin ping -h localhost -u root -p
```

## ❓ 常见问题解答

### Q: 转换速度很慢怎么办？
A: 检查网络连接，尝试较小的文件，或者联系管理员检查Stirling-PDF服务状态。

### Q: 支持哪些文件格式？
A: 支持PDF、DOC、DOCX、JPG、JPEG、PNG格式，更多格式持续增加中。

### Q: 文件会不会被永久保存？
A: 不会，所有文件在30分钟后会自动删除，确保用户隐私安全。

### Q: 如何获得技术支持？
A: 可以通过GitHub Issues提交问题，或者在项目讨论区提问。

## 📞 联系方式

- **项目主页**: [GitHub Repository](https://github.com/your-repo/pdf-to-word)
- **问题反馈**: GitHub Issues
- **技术讨论**: GitHub Discussions
- **邮件联系**: support@pdfconverter.com

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**最后更新**: 2024年1月
**版本**: 2.0.0
**维护者**: PDF转换团队