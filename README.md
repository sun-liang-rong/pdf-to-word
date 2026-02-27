# PDF 在线转换平台

一个简洁、快速、免费的在线PDF转换工具，支持PDF与Word、图片等多种格式互转。

## 功能特性

- PDF转Word (.docx)
- Word转PDF (.pdf)
- PDF转JPG图片
- JPG/PNG转PDF
- 完全免费，无需注册
- 文件30分钟自动删除，安全可靠
- 支持最大20MB文件

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
- Redis
- Bull Queue

### 文件处理
- LibreOffice (文档转换)
- Poppler (PDF处理)
- ImageMagick (图片处理)

## 快速开始

### 环境要求

- Node.js >= 18
- Docker & Docker Compose
- **LibreOffice** (必须安装，用于文档转换)
- **Poppler** (必须安装，用于 PDF 转图片)
- **ImageMagick** (必须安装，用于图片处理)

### 系统依赖安装

#### Windows 系统

1. **LibreOffice** 下载地址：https://www.libreoffice.org/download/download/

2. **Poppler for Windows**：
   - 下载地址：https://github.com/oschwartz10612/poppler-windows/releases/
   - 解压后将 `bin` 目录添加到系统 PATH 环境变量

3. **ImageMagick** 下载地址：https://imagemagick.org/script/download.php#windows

4. **将工具添加到 PATH**：
   ```powershell
   # 在 PowerShell 中验证安装
   soffice --version          # LibreOffice
   pdftoppm -v               # Poppler
   convert -version          # ImageMagick
   ```

#### Linux 系统 (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y libreoffice poppler-utils imagemagick
```

#### macOS

```bash
brew install libreoffice poppler imagemagick
```

### 安装步骤

1. 启动数据库服务（MySQL + Redis）

```bash
docker-compose up -d
```

2. 安装后端依赖

```bash
cd backend
npm install
```

3. 启动后端 API 服务

```bash
npm run start:dev
```

4. 安装前端依赖

```bash
cd frontend
npm install
```

5. 启动前端服务

```bash
npm run dev
```

### 访问地址

- 前端: http://localhost:3000
- 后端API: http://localhost:3001/api

---

## Docker 服务说明

### 整体架构流程图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   前端      │     │  后端 API   │     │   Redis    │     │   Worker    │
│ (Next.js)   │     │  (NestJS)   │     │   队列     │     │  (转换进程)  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │  1.上传文件       │                   │                   │
       │─────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │  2.保存文件        │                   │
       │                   │──────────────────>│                   │
       │                   │    (写入uploads/)  │                   │
       │                   │                   │                   │
       │                   │  3.创建任务       │                   │
       │                   │  4.加入队列       │                   │
       │                   │─────────────────>│                   │
       │                   │                   │                   │
       │  5.返回taskId     │                   │                   │
       │<─────────────────│                   │                   │
       │                   │                   │                   │
       │  6.轮询任务状态   │                   │  7.获取任务       │
       │─────────────────>│                   │<─────────────────│
       │                   │                   │                   │
       │                   │                   │  8.执行转换       │
       │                   │                   │  (LibreOffice)   │
       │                   │                   │                   │
       │                   │  9.更新状态       │                   │
       │                   │<─────────────────│                   │
       │                   │                   │                   │
       │  10.返回完成状态  │                   │                   │
       │<─────────────────│                   │                   │
       │                   │                   │                   │
       │  11.下载文件      │                   │                   │
       │─────────────────>│                   │                   │
       │<─────────────────│                   │                   │
       │                   │                   │                   │
```

### 详细步骤说明

#### 第一阶段：文件上传与任务创建

| 步骤 | 操作 | 涉及文件/模块 |
|------|------|---------------|
| 1 | 用户在前端选择文件，点击上传 | `FileUploader.tsx` |
| 2 | 前端发送 POST 请求到 `/api/convert`，包含文件二进制和转换类型 | `conversion.controller.ts` |
| 3 | 后端校验文件类型（白名单）、大小（≤20MB） | `conversion.service.ts` |
| 4 | 后端生成 UUID 作为任务ID，保存原始文件到 `uploads/` 目录 | `conversion.service.ts` |
| 5 | 在 MySQL 数据库创建任务记录，状态为 `waiting` | `task.entity.ts` |
| 6 | 将任务ID推送到 Redis 队列 `queue:conversion:waiting` | `queue.service.ts` |
| 7 | 返回 taskId 给前端 | `conversion.controller.ts` |

#### 第二阶段：任务处理（Worker）

| 步骤 | 操作 | 涉及文件/模块 |
|------|------|---------------|
| 8 | Worker 从 Redis 队列获取任务（阻塞等待） | `worker.service.ts` |
| 9 | 更新任务状态为 `processing` | `task.service.ts` |
| 10 | 根据转换类型调用对应工具：<br>• PDF→Word: `libreoffice --convert-to docx`<br>• Word→PDF: `libreoffice --convert-to pdf`<br>• PDF→JPG: `pdftoppm -jpeg`<br>• JPG→PDF: `convert` | `worker.service.ts` |
| 11 | 转换完成后，更新任务状态为 `completed`，保存输出文件路径 | `worker.service.ts` |

#### 第三阶段：文件下载

| 步骤 | 操作 | 涉及文件/模块 |
|------|------|---------------|
| 12 | 前端轮询 `/api/task/:id` 查询任务状态 | `ConversionProgress.tsx` |
| 13 | 后端返回状态 `completed` 和下载链接 | `task.controller.ts` |
| 14 | 用户点击下载按钮，访问 `/api/download/:id` | `upload.controller.ts` |
| 15 | 后端验证任务状态，发送文件给浏览器 | `upload.service.ts` |

### 关键文件说明

| 文件 | 职责 |
|------|------|
| `FileUploader.tsx` | 前端文件上传组件，处理拖拽和点击选择 |
| `conversion.controller.ts` | 接收上传请求，创建转换任务 |
| `conversion.service.ts` | 文件校验、保存、任务创建 |
| `queue.service.ts` | Redis 队列操作（入队/出队） |
| `worker.service.ts` | 后台转换进程，执行实际文件转换 |
| `task.controller.ts` | 提供任务状态查询 API |
| `upload.controller.ts` | 提供文件下载 API |
| `file-cleanup.service.ts` | 定时清理 30 分钟前的过期文件 |

### 定时清理流程

```
每 5 分钟执行一次 FileCleanupService：
  1. 查询 expires_at < 当前时间 的任务
  2. 删除 uploads/ 目录下的原始文件和转换后的文件
  3. 从数据库删除任务记录
```

---

## 项目结构与功能说明

```
pdf-to-word/
│
├── docker-compose.yml              # Docker 配置文件，用于启动 MySQL 和 Redis 数据库服务
│
├── frontend/                        # ===== 前端项目 (Next.js 15) =====
│   ├── src/
│   │   ├── app/                    # Next.js App Router 页面目录
│   │   │   ├── layout.tsx           # 根布局组件，包含 Header、Footer
│   │   │   ├── page.tsx             # 首页，展示工具列表和功能介绍
│   │   │   ├── providers.tsx        # React Query 提供者配置
│   │   │   ├── globals.css         # 全局 TailwindCSS 样式
│   │   │   ├── sitemap.ts          # SEO 站点地图
│   │   │   ├── pdf-to-word/        # PDF转Word 工具页面
│   │   │   │   ├── page.tsx        # 页面元数据和 SEO
│   │   │   │   └── client-page.tsx # 转换功能客户端组件
│   │   │   ├── word-to-pdf/        # Word转PDF 工具页面
│   │   │   ├── pdf-to-jpg/         # PDF转JPG 工具页面
│   │   │   └── jpg-to-pdf/         # JPG转PDF 工具页面
│   │   │
│   │   └── components/             # React 可复用组件
│   │       ├── layout/              # 布局组件
│   │       │   ├── Header.tsx      # 顶部导航栏
│   │       │   └── Footer.tsx      # 底部页脚
│   │       ├── upload/              # 文件上传组件
│   │       │   └── FileUploader.tsx # 拖拽/点击上传组件
│   │       ├── conversion/          # 转换相关组件
│   │       │   ├── ConversionProgress.tsx # 转换进度条
│   │       │   └── DownloadButton.tsx    # 下载按钮
│   │       └── seo/                 # SEO 优化组件
│   │           └── FAQ.tsx          # 常见问题组件
│   │
│   ├── public/                      # 静态资源
│   │   └── robots.txt               # 搜索引擎爬虫规则
│   │
│   ├── package.json                 # 前端依赖配置
│   ├── tailwind.config.ts           # TailwindCSS 配置
│   ├── next.config.js               # Next.js 配置
│   └── .env.local                   # 前端环境变量
│
├── backend/                         # ===== 后端项目 (NestJS) =====
│   ├── src/
│   │   ├── main.ts                  # 后端应用入口
│   │   ├── app.module.ts            # 根模块，整合所有子模块
│   │   │
│   │   ├── modules/                 # 功能模块目录
│   │   │   ├── conversion/          # 转换模块（核心）
│   │   │   │   ├── conversion.controller.ts  # 转换 API 控制器
│   │   │   │   ├── conversion.service.ts     # 转换服务逻辑
│   │   │   │   ├── conversion.module.ts      # 转换模块定义
│   │   │   │   └── dto/                      # 数据传输对象
│   │   │   │       └── create-conversion.dto.ts # 创建转换请求 DTO
│   │   │   │
│   │   │   ├── task/                # 任务管理模块
│   │   │   │   ├── task.controller.ts       # 任务状态查询 API
│   │   │   │   ├── task.service.ts          # 任务服务逻辑
│   │   │   │   ├── task.module.ts           # 任务模块定义
│   │   │   │   └── task.entity.ts          # 任务数据库实体
│   │   │   │
│   │   │   ├── upload/              # 文件上传/下载模块
│   │   │   │   ├── upload.controller.ts     # 下载 API 控制器
│   │   │   │   ├── upload.service.ts        # 文件操作服务
│   │   │   │   └── upload.module.ts         # 上传模块定义
│   │   │   │
│   │   │   ├── queue/               # Redis 队列模块
│   │   │   │   ├── queue.service.ts         # 队列服务（任务入队/出队）
│   │   │   │   └── queue.module.ts         # 队列模块定义
│   │   │   │
│   │   │   └── rate-limit/          # IP 限流模块
│   │   │       ├── rate-limit.guard.ts      # 限流守卫（防止滥用）
│   │   │       ├── rate-limit.entity.ts    # 限流记录实体
│   │   │       └── rate-limit.module.ts    # 限流模块定义
│   │   │
│   │   ├── worker/                  # 文件转换 Worker（独立进程）
│   │   │   ├── main.ts              # Worker 进程入口
│   │   │   ├── worker.module.ts     # Worker 模块
│   │   │   └── worker.service.ts    # 转换核心逻辑（调用 LibreOffice 等工具）
│   │   │
│   │   └── common/                  # 公共模块
│   │       ├── filters/             # 异常过滤器
│   │       │   └── global-exception.filter.ts # 全局异常处理
│   │       └── services/            # 公共服务
│   │           └── file-cleanup.service.ts   # 定时清理过期文件服务
│   │
│   ├── uploads/                     # 上传文件临时存储目录
│   │
│   ├── package.json                 # 后端依赖配置
│   ├── tsconfig.json                # TypeScript 配置
│   ├── nest-cli.json                # NestJS CLI 配置
│   └── .env                        # 后端环境变量
│
├── .gitignore                       # Git 忽略文件配置
│
└── README.md                        # 项目说明文档
```

---

## Docker 服务说明

当使用 `docker-compose up -d` 时，会启动以下服务：

| 服务名 | 端口 | 说明 |
|--------|------|------|
| mysql | 3306 | MySQL 8.0 数据库，存储任务记录 |
| redis | 6379 | Redis 缓存/队列，存储转换任务队列 |
| worker | (无) | 后台转换进程，运行在容器内，调用 LibreOffice/Poppler/ImageMagick 执行转换 |

### 后端模块说明

| 模块 | 功能 |
|------|------|
| **conversion** | 核心转换模块，处理文件上传、创建转换任务、校验文件类型 |
| **task** | 任务管理模块，查询任务状态、更新进度、管理任务生命周期 |
| **upload** | 文件服务模块，处理文件下载、删除临时文件 |
| **queue** | Redis 队列模块，管理任务入队、出队、任务状态追踪 |
| **rate-limit** | IP 限流模块，防止恶意频繁请求（每小时10次） |
| **worker** | 后台转换进程，从队列获取任务，调用 LibreOffice/Poppler/ImageMagick 执行转换 |
| **file-cleanup** | 定时任务服务，每5分钟检查并删除30分钟前的过期文件 |

---

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/convert` | POST | 上传文件并创建转换任务 |
| `/api/task/:id` | GET | 查询任务状态 |
| `/api/download/:id` | GET | 下载转换后的文件 |
| `/api/convert/tools` | GET | 获取支持的转换类型 |

## 环境变量

### 后端 (.env)

```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=root
DATABASE_NAME=pdf_converter

REDIS_HOST=localhost
REDIS_PORT=6379

PORT=3001
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=20971520
FILE_EXPIRE_MINUTES=30

RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=3600
```

### 前端 (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 安全措施

- 文件类型白名单校验
- 文件大小限制 (20MB)
- IP限流 (每小时10次)
- 文件名消毒防止路径遍历
- 命令注入防护
- 文件30分钟自动删除

## License

MIT
