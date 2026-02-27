# Stirling-PDF 集成方案规划

## 背景

之前的 LibreOffice 方案在 Docker 容器中遇到问题，转换失败。现在需要更换为更成熟的解决方案：**Stirling-PDF**。

## Stirling-PDF 简介

Stirling-PDF 是一个功能强大的开源 PDF 处理平台：
- **60+ PDF 工具**：转换、合并、拆分、签名、OCR 等
- **Docker 部署**：一键部署，开箱即用
- **REST API**：完整的 API 支持，易于集成
- **本地处理**：数据安全，不上传到外部服务
- **开源免费**：社区活跃，持续更新

## 方案优势

1. **成熟稳定**：Stirling-PDF 是经过大量生产验证的开源项目
2. **功能全面**：支持 PDF ↔ Word 双向转换
3. **部署简单**：Docker 一键部署，无需复杂配置
4. **API 友好**：提供 Swagger UI 文档，易于集成
5. **性能优越**：内置 LibreOffice，优化了转换流程

## 架构设计

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   NestJS API    │
│   Backend       │
└────────┬────────┘
         │ HTTP API
         ▼
┌─────────────────┐
│  Stirling-PDF   │
│  (Docker:8080)  │
│                 │
│  - LibreOffice  │
│  - PDF Tools    │
│  - OCR          │
└─────────────────┘
```

## 核心功能映射

| 当前功能 | Stirling-PDF API 端点 | 说明 |
|---------|---------------------|------|
| PDF → Word | `/api/v1/convert/pdf-to-word` | PDF 转 Word 文档 |
| Word → PDF | `/api/v1/convert/file-to-pdf` | Office 文档转 PDF |
| PDF → JPG | `/api/v1/convert/pdf-to-img` | PDF 转图片 |
| JPG → PDF | `/api/v1/convert/img-to-pdf` | 图片转 PDF |

## 实施步骤

### 1. Docker 部署 Stirling-PDF

**docker-compose.yml 配置：**

```yaml
services:
  stirling-pdf:
    image: stirlingtools/stirling-pdf:latest
    container_name: stirling-pdf
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - stirling-data:/configs
      - stirling-tmp:/tmp
    environment:
      - SECURITY_ENABLE_LOGIN=false
      - SYSTEM_DEFAULTLOCALE=zh-CN
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/info/status"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  stirling-data:
  stirling-tmp:
```

**启动命令：**
```bash
docker-compose up -d stirling-pdf
```

### 2. 创建 Stirling-PDF 服务模块

**文件：`backend/src/modules/stirling-pdf/stirling-pdf.service.ts`**

封装 Stirling-PDF API 调用：

```typescript
@Injectable()
export class StirlingPdfService {
  private readonly baseUrl = 'http://stirling-pdf:8080';

  async convertPdfToWord(pdfBuffer: Buffer): Promise<Buffer> {
    // POST /api/v1/convert/pdf-to-word
  }

  async convertWordToPdf(docBuffer: Buffer): Promise<Buffer> {
    // POST /api/v1/convert/file-to-pdf
  }

  async convertPdfToJpg(pdfBuffer: Buffer): Promise<Buffer> {
    // POST /api/v1/convert/pdf-to-img
  }

  async convertJpgToPdf(imgBuffer: Buffer): Promise<Buffer> {
    // POST /api/v1/convert/img-to-pdf
  }
}
```

### 3. 更新 Worker 服务

**文件：`backend/src/worker/worker.service.ts`**

修改转换逻辑，调用 Stirling-PDF 服务：

```typescript
private async convert(task: ConversionTask): Promise<string> {
  const inputBuffer = fs.readFileSync(task.inputPath);
  
  switch (task.type) {
    case ConversionType.PDF_TO_WORD:
      return await this.stirlingPdfService.convertPdfToWord(inputBuffer);
    case ConversionType.WORD_TO_PDF:
      return await this.stirlingPdfService.convertWordToPdf(inputBuffer);
    // ... 其他类型
  }
}
```

### 4. 更新环境配置

**文件：`backend/.env`**

```env
STIRLING_PDF_URL=http://stirling-pdf:8080
```

### 5. 测试验证

1. 启动 Stirling-PDF 容器
2. 访问 `http://localhost:8080/swagger-ui/index.html` 查看 API 文档
3. 测试各个转换端点
4. 集成到 NestJS 并验证

## API 端点详情

### PDF 转 Word

```bash
POST /api/v1/convert/pdf-to-word
Content-Type: multipart/form-data

参数：
- fileInput: PDF 文件
- outputFormat: docx (可选)

返回：Word 文件 (application/octet-stream)
```

### Office 文档转 PDF

```bash
POST /api/v1/convert/file-to-pdf
Content-Type: multipart/form-data

参数：
- fileInput: Office 文件 (docx, xlsx, pptx)

返回：PDF 文件
```

### PDF 转图片

```bash
POST /api/v1/convert/pdf-to-img
Content-Type: multipart/form-data

参数：
- fileInput: PDF 文件
- imageFormat: jpeg/png
- dpi: 150/300

返回：ZIP 压缩包（多页 PDF 会生成多张图片）
```

### 图片转 PDF

```bash
POST /api/v1/convert/img-to-pdf
Content-Type: multipart/form-data

参数：
- fileInput: 图片文件

返回：PDF 文件
```

## 文件清单

### 需要创建的文件

1. `backend/src/modules/stirling-pdf/stirling-pdf.module.ts`
2. `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`
3. `backend/src/modules/stirling-pdf/stirling-pdf.interface.ts`

### 需要修改的文件

1. `docker-compose.yml` - 添加 Stirling-PDF 服务
2. `backend/src/worker/worker.service.ts` - 更新转换逻辑
3. `backend/src/app.module.ts` - 注册 Stirling-PDF 模块
4. `backend/.env` - 添加 Stirling-PDF URL 配置

## 实施顺序

1. ✅ 更新 `docker-compose.yml` 添加 Stirling-PDF 服务
2. ✅ 启动 Stirling-PDF 容器并验证
3. ✅ 创建 `stirling-pdf` 服务模块
4. ✅ 更新 `worker.service.ts` 使用新服务
5. ✅ 测试所有转换功能
6. ✅ 验证端到端流程

## 预期效果

- ✅ 稳定的 PDF ↔ Word 转换能力
- ✅ 支持多种文件格式转换
- ✅ Docker 容器化部署，易于管理
- ✅ 完整的 API 文档和测试界面
- ✅ 开源免费，无需外部依赖

## 注意事项

1. **内存配置**：Stirling-PDF 需要足够内存（建议 2GB+）
2. **超时设置**：大文件转换可能需要较长时间
3. **并发限制**：LibreOffice 转换不支持高并发
4. **临时文件**：Stirling-PDF 会自动清理临时文件
5. **安全配置**：生产环境建议启用认证

## 备选方案

如果 Stirling-PDF 也遇到问题，可以考虑：

1. **pdf2docx** (Python 库)
   - 专门用于 PDF 转 Word
   - 可以通过 Python 子进程调用

2. **Aspose.PDF** (商业方案)
   - 功能强大，转换质量高
   - 需要付费授权

3. **在线 API 服务**
   - CloudConvert
   - ConvertAPI
   - 需要付费，数据上传到外部服务

## 参考资源

- Stirling-PDF 官网：https://www.stirlingpdf.com
- GitHub：https://github.com/Stirling-Tools/Stirling-PDF
- 文档：https://docs.stirlingpdf.com
- API 文档：http://localhost:8080/swagger-ui/index.html (本地部署后)
