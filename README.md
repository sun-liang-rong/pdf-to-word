# PDF 在线转换平台

一个简洁、快速、免费的在线PDF转换工具，支持PDF与Word、图片等多种格式互转。

## 功能特性

- **PDF 转 Word** - 支持 PDF 转换为 DOC/DOCX 格式
- **Word 转 PDF** - 支持 Word 文档转换为 PDF
- **PDF 转 JPG** - 支持 PDF 转换为 JPEG/PNG 图片
- **JPG 转 PDF** - 支持图片转换为 PDF
- **OCR 识别** - 支持对扫描件 PDF 进行文字识别
- 完全免费，无需注册
- 文件 30 分钟自动删除，安全可靠
- IP 限流：每个IP每天 10 次转换

## 技术栈

### 前端
- Next.js 15 (App Router)
- React 18
- TailwindCSS
- React Query
- React Dropzone

### 后端
- NestJS
- TypeORM
- MySQL 8.0

### 文件处理
- Stirling-PDF (开源 PDF 处理服务)

## 快速开始

### 环境要求

- Node.js >= 18
- MySQL 8.0
- Stirling-PDF 服务

### 安装步骤

1. **启动 Stirling-PDF 服务**

```bash
# 使用 Docker 启动 Stirling-PDF
docker run -d -p 8080:8080 frooodle/s-pdf:latest
```

2. **启动 MySQL 数据库**

```bash
docker compose up -d
```

3. **安装后端依赖**

```bash
cd backend
npm install
```

4. **配置环境变量**

创建 `backend/.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=pdf_converter

# Stirling-PDF 配置
STIRLING_PDF_URL=http://localhost:8080
STIRLING_PDF_TIMEOUT=300000

# 文件配置
UPLOAD_DIR=./uploads
FILE_EXPIRY_MINUTES=30

# 限流配置
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=86400000

# 端口
PORT=3000
```

5. **启动后端服务**

```bash
npm run start:dev
# 或使用 PM2
pm2 start ecosystem.config.js
```

6. **安装前端依赖并启动**

```bash
cd frontend
npm install
npm run dev
```

### 访问地址

- 前端: http://localhost:3000
- 后端 API: http://localhost:3000/api

---

## 项目架构

### 转换流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   前端      │     │  后端 API   │     │ Stirling-PDF│
│ (Next.js)   │────>│  (NestJS)   │────>│   服务      │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   MySQL     │
                    │   数据库    │
                    └─────────────┘
```

### 转换流程说明

| 步骤 | 操作 |
|------|------|
| 1 | 用户在前端选择文件，点击上传 |
| 2 | 后端校验文件类型、大小 |
| 3 | 后端将文件发送给 Stirling-PDF 进行转换 |
| 4 | 转换完成后保存文件到本地 |
| 5 | 返回下载链接给前端 |
| 6 | 用户下载转换后的文件 |
| 7 | 30分钟后自动删除过期文件 |

---

## 项目结构

```
pdf-to-word/
│
├── docker-compose.yml           # Docker 配置（MySQL）
│
├── ecosystem.config.js          # PM2 部署配置
│
├── frontend/                    # 前端项目 (Next.js 15)
│   ├── src/
│   │   ├── app/                # App Router 页面
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── pdf-to-word/   # PDF转Word
│   │   │   ├── word-to-pdf/   # Word转PDF
│   │   │   ├── pdf-to-jpg/    # PDF转图片
│   │   │   └── jpg-to-pdf/    # 图片转PDF
│   │   └── components/         # React 组件
│   │       ├── upload/          # 文件上传
│   │       └── conversion/     # 转换组件
│   └── package.json
│
├── backend/                     # 后端项目 (NestJS)
│   ├── src/
│   │   ├── main.ts             # 应用入口
│   │   ├── app.module.ts       # 根模块
│   │   └── modules/
│   │       ├── conversion/     # 转换模块
│   │       ├── task/            # 任务管理
│   │       ├── upload/          # 文件服务
│   │       ├── rate-limit/      # IP限流
│   │       └── stirling-pdf/    # Stirling-PDF集成
│   ├── uploads/                # 文件存储
│   └── package.json
│
└── README.md
```

---

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/convert` | POST | 上传文件并创建转换任务 |
| `/api/task/:id` | GET | 查询任务状态 |
| `/api/download/:id` | GET | 下载转换后的文件 |
| `/api/convert/tools` | GET | 获取支持的转换类型 |

---

## PM2 部署

### 安装 PM2

```bash
npm install -g pm2
```

### 部署命令

```bash
# 构建项目
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build

# 启动服务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 开机自启
pm2 startup
pm2 save
```

### 服务端口

| 服务 | 端口 |
|------|------|
| 前端 | 3000 |
| 后端 | 3000 (通过 Next.js 代理) |

---

## 安全措施

- 文件类型白名单校验
- 文件大小限制
- IP 限流（每天 10 次）
- 文件名消毒
- 文件 30 分钟自动删除

## License

MIT
