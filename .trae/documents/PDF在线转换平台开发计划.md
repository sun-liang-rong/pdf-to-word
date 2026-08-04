# PDF 在线转换平台 — 详细开发计划

## 一、项目概述

### 1.1 项目结构
```
pdf-to-word/
├── frontend/                 # Next.js 15 前端项目
│   ├── app/                  # App Router 页面
│   ├── components/           # React 组件
│   ├── lib/                  # 工具函数
│   └── public/               # 静态资源
├── backend/                  # NestJS 后端项目
│   ├── src/
│   │   ├── modules/          # 功能模块
│   │   ├── common/           # 公共模块
│   │   └── worker/           # 转换 Worker
│   └── uploads/              # 临时文件目录
└── docker/                   # Docker 配置
```

---

## 二、开发阶段划分

### 阶段一：项目初始化与基础架构（第1-2天）

#### 2.1.1 前端项目初始化
- [ ] 创建 Next.js 15 项目（App Router）
- [ ] 配置 TailwindCSS
- [ ] 配置 TypeScript
- [ ] 创建基础布局组件（Header、Footer、Layout）
- [ ] 配置环境变量

#### 2.1.2 后端项目初始化
- [ ] 创建 NestJS 项目
- [ ] 配置 TypeORM + MySQL
- [ ] 配置 Redis 连接
- [ ] 创建数据库实体（ConversionTask）
- [ ] 配置文件上传模块（Multer）
- [ ] 配置全局异常过滤器
- [ ] 配置全局响应拦截器

#### 2.1.3 基础设施配置
- [ ] Docker Compose 配置（MySQL、Redis）
- [ ] 环境变量配置文件
- [ ] 日志系统配置

---

### 阶段二：核心功能开发（第3-5天）

#### 2.2.1 数据库设计

**表：conversion_tasks**
```sql
CREATE TABLE conversion_tasks (
  id VARCHAR(36) PRIMARY KEY,
  original_name VARCHAR(255) NOT NULL,
  input_path VARCHAR(500) NOT NULL,
  output_path VARCHAR(500),
  type VARCHAR(50) NOT NULL,
  status ENUM('waiting', 'processing', 'completed', 'failed') DEFAULT 'waiting',
  error_message TEXT,
  file_size BIGINT,
  ip_address VARCHAR(45),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at DATETIME
);
```

**表：rate_limits（IP限流）**
```sql
CREATE TABLE rate_limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  request_count INT DEFAULT 1,
  window_start DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_ip (ip_address)
);
```

#### 2.2.2 后端 API 开发

**模块结构：**
```
backend/src/modules/
├── conversion/              # 转换模块
│   ├── conversion.controller.ts
│   ├── conversion.service.ts
│   ├── conversion.module.ts
│   └── dto/
│       ├── upload.dto.ts
│       └── convert.dto.ts
├── task/                    # 任务模块
│   ├── task.controller.ts
│   ├── task.service.ts
│   └── task.module.ts
├── upload/                  # 上传模块
│   ├── upload.controller.ts
│   ├── upload.service.ts
│   └── upload.module.ts
└── rate-limit/              # 限流模块
    ├── rate-limit.guard.ts
    └── rate-limit.module.ts
```

**API 接口：**

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/upload` | POST | 上传文件 |
| `/api/convert` | POST | 创建转换任务 |
| `/api/task/:id` | GET | 查询任务状态 |
| `/api/download/:id` | GET | 下载转换文件 |
| `/api/tools` | GET | 获取支持的转换类型 |

#### 2.2.3 Redis 队列系统

**队列设计：**
```
Redis Keys:
- queue:conversion:waiting    # 等待队列（List）
- queue:conversion:processing # 处理中（Hash）
- task:{id}:status           # 任务状态（String）
```

**队列处理流程：**
1. 文件上传 → 创建任务记录
2. 任务入队（LPUSH）
3. Worker 获取任务（BRPOP）
4. 更新状态为 processing
5. 执行转换
6. 更新状态为 completed/failed
7. 设置过期时间（30分钟）

#### 2.2.4 文件转换 Worker

**Worker 结构：**
```
backend/src/worker/
├── worker.module.ts
├── worker.service.ts
├── converters/
│   ├── converter.interface.ts
│   ├── pdf-to-word.converter.ts
│   ├── word-to-pdf.converter.ts
│   └── index.ts
└── utils/
    ├── libreoffice.util.ts
    ├── pdf.util.ts
    └── file.util.ts
```

**转换工具调用：**
- PDF → Word: `pdftotext` + LibreOffice 或 `pdf2docx`
- Word → PDF: LibreOffice `--convert-to pdf`

---

### 阶段三：前端页面开发（第6-8天）

#### 2.3.1 页面结构

```
frontend/app/
├── layout.tsx               # 根布局
├── page.tsx                 # 首页
├── pdf-to-word/
│   └── page.tsx            # PDF转Word页面
├── word-to-pdf/
│   └── page.tsx            # Word转PDF页面
├── pdf-to-jpg/
│   └── page.tsx            # PDF转JPG页面
├── jpg-to-pdf/
│   └── page.tsx            # JPG转PDF页面
└── api/                    # API 路由（代理）
```

#### 2.3.2 组件设计

```
frontend/components/
├── layout/
│   ├── Header.tsx          # 导航头部
│   ├── Footer.tsx          # 页脚
│   └── Layout.tsx          # 布局容器
├── upload/
│   ├── FileUploader.tsx    # 文件上传组件
│   ├── DragDropZone.tsx    # 拖拽上传区域
│   └── FilePreview.tsx     # 文件预览
├── conversion/
│   ├── ConversionProgress.tsx  # 转换进度
│   ├── ConversionStatus.tsx    # 状态显示
│   └── DownloadButton.tsx      # 下载按钮
├── seo/
│   ├── FAQ.tsx             # FAQ组件
│   └── SEOText.tsx         # SEO文本区域
└── ui/
    ├── Button.tsx          # 按钮组件
    ├── Card.tsx            # 卡片组件
    └── Spinner.tsx         # 加载动画
```

#### 2.3.3 首页设计

**内容结构：**
1. Hero 区域 - 标题 + 简介 + 主要工具入口
2. 工具列表 - 所有转换工具卡片
3. 功能特点 - 平台优势展示
4. SEO 文本区域 - 关键词优化内容
5. FAQ 区域 - 常见问题

#### 2.3.4 工具页设计

**页面元素：**
1. H1 标题 - 包含关键词
2. 功能介绍 - 简短描述
3. 文件上传区 - 拖拽 + 点击上传
4. 转换进度条
5. 状态提示
6. 下载按钮
7. 操作步骤说明
8. FAQ 区域（SEO）

---

### 阶段四：SEO 优化（第9天）

#### 2.4.1 技术SEO

- [ ] 配置 Next.js Metadata API
- [ ] 生成 sitemap.xml
- [ ] 配置 robots.txt
- [ ] 添加结构化数据（JSON-LD）
- [ ] 配置 Open Graph 标签
- [ ] 配置 Twitter Card

#### 2.4.2 页面SEO

**每个工具页必须包含：**
```typescript
// 元数据配置示例
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: 'PDF转Word在线转换 - 免费快速转换工具',
    description: '免费在线PDF转Word转换器，支持批量转换...',
    keywords: 'PDF转Word, PDF to Word, 在线转换...',
    openGraph: {
      title: '...',
      description: '...',
    }
  }
}
```

#### 2.4.3 内容SEO

**关键词布局：**
- 主关键词：PDF转Word、Word转PDF、PDF转换器
- 长尾关键词：免费PDF转Word、在线PDF转换、PDF怎么转Word

**内容要求：**
- H1 标题包含主关键词
- 首段包含核心关键词
- FAQ 包含长尾关键词
- 内链建设

---

### 阶段五：安全措施（第10天）

#### 2.5.1 文件安全

```typescript
// 文件类型校验
const ALLOWED_TYPES = {
  'pdf-to-word': ['application/pdf'],
  'word-to-pdf': ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'pdf-to-jpg': ['application/pdf'],
  'jpg-to-pdf': ['image/jpeg', 'image/png', 'image/jpg']
};

// 文件大小限制
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
```

#### 2.5.2 安全中间件

- [ ] 文件类型白名单校验
- [ ] 文件大小限制
- [ ] IP 限流（每IP每小时10次）
- [ ] 请求频率限制
- [ ] 文件名消毒（防止路径遍历）
- [ ] 命令注入防护

#### 2.5.3 文件清理

```typescript
// 定时任务清理过期文件
@Cron('*/5 * * * *')  // 每5分钟执行
async cleanupExpiredFiles() {
  const expiredTasks = await this.taskRepository.findExpired();
  for (const task of expiredTasks) {
    await this.fileService.deleteFile(task.input_path);
    await this.fileService.deleteFile(task.output_path);
  }
}
```

---

### 阶段六：测试与部署（第11-12天）

#### 2.6.1 测试

- [ ] 单元测试（Service 层）
- [ ] E2E 测试（API 接口）
- [ ] 文件转换测试
- [ ] 边界条件测试
- [ ] 性能测试

#### 2.6.2 部署配置

**Docker Compose：**
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend

  frontend:
    build: ./frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=mysql://...
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mysql
      - redis

  worker:
    build: ./backend
    command: npm run worker
    depends_on:
      - backend
      - redis

  mysql:
    image: mysql:8.0
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
```

#### 2.6.3 Nginx 配置

```nginx
server {
    listen 80;
    server_name example.com;

    # 前端
    location / {
        proxy_pass http://frontend:3000;
    }

    # API
    location /api {
        proxy_pass http://backend:3001;
        client_max_body_size 20M;
    }

    # 下载文件
    location /downloads {
        alias /app/backend/downloads;
        expires 30m;
    }
}
```

---

## 三、技术实现细节

### 3.1 文件转换实现

#### PDF 转 Word
```typescript
async convertPdfToWord(inputPath: string, outputPath: string): Promise<void> {
  // 方案1: 使用 pdf2docx (Python库，需要安装)
  // 方案2: 使用 LibreOffice + pdftotext
  
  const command = `libreoffice --headless --convert-to docx --outdir ${outputDir} ${inputPath}`;
  await this.executeCommand(command);
}
```

#### Word 转 PDF
```typescript
async convertWordToPdf(inputPath: string, outputPath: string): Promise<void> {
  const command = `libreoffice --headless --convert-to pdf --outdir ${outputDir} ${inputPath}`;
  await this.executeCommand(command);
}
```

### 3.2 队列处理流程

```typescript
// 生产者 - 添加任务到队列
async addConversionTask(taskId: string): Promise<void> {
  await this.redis.lpush('queue:conversion:waiting', taskId);
  await this.redis.hset('task:status', taskId, 'waiting');
}

// 消费者 - Worker 处理
async processQueue(): Promise<void> {
  while (true) {
    const result = await this.redis.brpop('queue:conversion:waiting', 0);
    const taskId = result[1];
    
    try {
      await this.updateStatus(taskId, 'processing');
      await this.convert(taskId);
      await this.updateStatus(taskId, 'completed');
    } catch (error) {
      await this.updateStatus(taskId, 'failed');
    }
  }
}
```

### 3.3 前端状态管理

```typescript
// 使用 React Query 管理任务状态
const { data: taskStatus } = useQuery({
  queryKey: ['task', taskId],
  queryFn: () => fetchTaskStatus(taskId),
  refetchInterval: (data) => 
    data?.status === 'completed' || data?.status === 'failed' ? false : 1000
});
```

---

## 四、开发优先级

### P0 - 必须完成（第一阶段）
1. 项目初始化
2. PDF 转 Word 功能
3. Word 转 PDF 功能
4. 基础前端页面
5. 队列系统

### P1 - 重要功能（第二阶段）
1. PDF 转 JPG
2. JPG 转 PDF
3. SEO 优化
4. 安全措施

### P2 - 扩展功能（第三阶段）
1. PPT 转 PDF
2. Excel 转 PDF
3. HTML 转 PDF
4. PDF 转 PPT
5. PDF 转 Excel
6. PDF 转 PDF/A

---

## 五、依赖清单

### 前端依赖
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "react-dropzone": "^14.0.0"
  }
}
```

### 后端依赖
```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/bull": "^10.0.0",
    "typeorm": "^0.3.0",
    "mysql2": "^3.0.0",
    "ioredis": "^5.0.0",
    "bull": "^4.0.0",
    "multer": "^1.4.0",
    "uuid": "^9.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0"
  }
}
```

### 系统依赖
- Node.js >= 18
- MySQL >= 8.0
- Redis >= 6.0
- LibreOffice >= 7.0
- Poppler Utils (pdftotext, pdf2image)
- ImageMagick

---

## 六、预估工时

| 阶段 | 任务 | 预估时间 |
|------|------|----------|
| 阶段一 | 项目初始化 | 1-2天 |
| 阶段二 | 核心功能开发 | 3-4天 |
| 阶段三 | 前端页面开发 | 3天 |
| 阶段四 | SEO优化 | 1天 |
| 阶段五 | 安全措施 | 1天 |
| 阶段六 | 测试部署 | 2天 |
| **总计** | | **11-13天** |

---

## 七、风险与注意事项

### 7.1 技术风险
1. **LibreOffice 转换质量** - 复杂PDF可能转换效果不佳
2. **内存占用** - 大文件转换可能占用大量内存
3. **并发限制** - 需要合理控制Worker数量

### 7.2 安全风险
1. **恶意文件上传** - 需要严格的文件校验
2. **命令注入** - 需要对文件名进行消毒
3. **资源滥用** - 需要IP限流和并发控制

### 7.3 运维风险
1. **磁盘空间** - 需要定期清理临时文件
2. **队列积压** - 需要监控队列长度
3. **服务可用性** - 需要健康检查和自动重启

---

## 八、后续优化方向

1. **性能优化**
   - 使用 Bull Board 监控队列
   - 添加任务优先级
   - 实现断点续传

2. **功能扩展**
   - 批量转换
   - OCR识别
   - 文件压缩
   - 云存储集成

3. **用户体验**
   - 暗黑模式
   - 多语言支持
   - 转换历史记录
   - 邮件通知
