import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as FormData from 'form-data';
import * as path from 'path';
import { 
  StirlingPdfConfig, 
  ConvertPdfToWordOptions, 
  ConvertFileToPdfOptions,
  ConvertPdfToImgOptions,
  ConvertImgToPdfOptions,
  OcrPdfOptions,
  SmartPdfToWordOptions,
  ImageFormat,
  SingleOrMultiple,
  ColorType,
  FitOption,
  PdfColorType
} from './stirling-pdf.interface';

@Injectable()
export class StirlingPdfService {
  private readonly logger = new Logger(StirlingPdfService.name);
  private readonly config: StirlingPdfConfig;
  private readonly client: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.config = {
      baseUrl: this.configService.get('STIRLING_PDF_URL') || 'http://localhost:8080',
      timeout: parseInt(this.configService.get('STIRLING_PDF_TIMEOUT') || '300000', 10),
    };
    this.logger.log(`Stirling-PDF Service initialized: ${this.config.baseUrl}`);
    const baseUrl = this.config.baseUrl.replace(/\/+$/, '');
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: this.config.timeout,
      headers: {
        'User-Agent': 'NestJS-StirlingPDF-Client/1.0',
      },
      responseType: 'arraybuffer',
      maxContentLength: Infinity as any,
      maxBodyLength: Infinity as any,
      validateStatus: () => true,
    });
  }

  async convertPdfToWord(
    pdfBuffer: Buffer,
    filename: string,
    options: ConvertPdfToWordOptions = {},
  ): Promise<Buffer> {
    this.logger.log(`Converting PDF to Word: ${filename}`);
    
    const fields: Record<string, string | Buffer> = { fileInput: pdfBuffer, outputFormat: options.outputFormat || 'doc' };

    return this.makeMultipartRequest('/api/v1/convert/pdf/word', fields, filename);
  }

  async ocrPdf(
    pdfBuffer: Buffer,
    filename: string,
    options: OcrPdfOptions = {},
  ): Promise<Buffer> {
    const fields: Record<string, string | Buffer> = {
      fileInput: pdfBuffer,
      languages: options.languages || 'chi_sim+eng',
      sidecar: String(options.sidecar ?? false),
      deskew: String(options.deskew ?? true),
      clean: String(options.clean ?? false),
      cleanFinal: String(options.cleanFinal ?? true),
      ocrType: options.ocrType || 'auto',
      ocrRenderType: options.ocrRenderType || 'searchable',
    };
    return this.makeMultipartRequest('/api/v1/ocr/pdf', fields, filename);
  }

  private pdfHasText(pdfBuffer: Buffer): boolean {
    try {
      const slice = pdfBuffer.subarray(0, Math.min(pdfBuffer.length, 256 * 1024)).toString('latin1');
      const hasBTET = /BT[\s\S]*?ET/.test(slice);
      const hasFont = /\/Font|Tf\b/.test(slice);
      const hasTextShow = /Tj|TJ|\((?:\\\)|[^)])+\)\s*Tj/.test(slice);
      return hasBTET || hasFont || hasTextShow;
    } catch {
      return false;
    }
  }

  async convertPdfToWordSmart(
    pdfBuffer: Buffer,
    filename: string,
    options: SmartPdfToWordOptions = {},
  ): Promise<Buffer> {
    const enableOcr = options.enableOcr ?? true;
    let sourceBuffer = pdfBuffer;

    if (enableOcr && !this.pdfHasText(pdfBuffer)) {
      this.logger.log('PDF appears image-only. Running OCR before conversion...');
      try {
        sourceBuffer = await this.ocrPdf(pdfBuffer, filename, options.ocr);
      } catch (err: any) {
        this.logger.warn(`OCR step failed (${err?.message}). Proceeding without OCR.`);
        sourceBuffer = pdfBuffer;
      }
    }

    return this.convertPdfToWord(sourceBuffer, filename, { outputFormat: options.outputFormat || 'doc' });
  }

  async convertFileToPdf(
    fileBuffer: Buffer,
    filename: string,
    options: ConvertFileToPdfOptions = {},
  ): Promise<Buffer> {
    this.logger.log(`Converting file to PDF: ${filename}`);
    
    const fields: Record<string, string | Buffer> = {
      fileInput: fileBuffer,
    };

    return this.makeMultipartRequest('/api/v1/convert/file/pdf', fields, filename);
  }

  async convertPdfToImg(
    pdfBuffer: Buffer,
    filename: string,
    options: ConvertPdfToImgOptions = {},
  ): Promise<Buffer> {
    this.logger.log(`Converting PDF to image: ${filename}`);
    
    this.validatePdfToImgOptions(options);

    const fields: Record<string, string | Buffer> = {};

    if (options.fileId) {
      fields.fileId = options.fileId;
    } else if (pdfBuffer) {
      fields.fileInput = pdfBuffer;
    } else {
      throw new Error('必须提供 fileInput (PDF文件) 或 fileId (服务器文件ID)');
    }

    fields.pageNumbers = options.pageNumbers || 'all';
    fields.imageFormat = options.imageFormat || 'jpeg';
    fields.singleOrMultiple = options.singleOrMultiple || 'multiple';
    fields.colorType = options.colorType || 'color';
    fields.dpi = String(options.dpi || 150);
    fields.includeAnnotations = String(options.includeAnnotations ?? false);

    return this.makeMultipartRequest('/api/v1/convert/pdf/img', fields, filename);
  }

  private validatePdfToImgOptions(options: ConvertPdfToImgOptions): void {
    if (options.fileInput && options.fileId) {
      throw new Error('fileInput 和 fileId 不能同时使用，请只选择其中一个');
    }

    if (options.pageNumbers) {
      const validPagePatterns = [
        /^(\d+,)*\d+$/,
        /^\d+-\d+$/,
        /^all$/,
        /^(\d+n[\+\-]\d+)$/,
        /^(\d+n)$/,
      ];
      const isValid = validPagePatterns.some(pattern => pattern.test(options.pageNumbers!));
      if (!isValid) {
        throw new Error(`无效的 pageNumbers 格式: ${options.pageNumbers}。支持的格式: 单页(1,3,5)、范围(5-9)、all、函数(2n+1, 3n, 6n-5)`);
      }
    }

    const validImageFormats: ImageFormat[] = ['jpeg', 'png', 'tiff', 'gif', 'bmp', 'webp'];
    if (options.imageFormat && !validImageFormats.includes(options.imageFormat)) {
      throw new Error(`无效的 imageFormat: ${options.imageFormat}。支持的格式: ${validImageFormats.join(', ')}`);
    }

    const validSingleOrMultiple: SingleOrMultiple[] = ['single', 'multiple'];
    if (options.singleOrMultiple && !validSingleOrMultiple.includes(options.singleOrMultiple)) {
      throw new Error(`无效的 singleOrMultiple: ${options.singleOrMultiple}。支持的值: single, multiple`);
    }

    const validColorTypes: ColorType[] = ['color', 'grayscale', 'blackwhite'];
    if (options.colorType && !validColorTypes.includes(options.colorType)) {
      throw new Error(`无效的 colorType: ${options.colorType}。支持的值: color, grayscale, blackwhite`);
    }

    if (options.dpi !== undefined) {
      if (!Number.isInteger(options.dpi) || options.dpi < 72 || options.dpi > 600) {
        throw new Error(`无效的 DPI: ${options.dpi}。DPI 必须在 72-600 之间`);
      }
    }

    if (options.fileId !== undefined && typeof options.fileId !== 'string') {
      throw new Error(`无效的 fileId: 必须为字符串类型`);
    }
  }

  async convertImgToPdf(
    imgBuffer: Buffer,
    filename: string,
    options: ConvertImgToPdfOptions = {},
  ): Promise<Buffer> {
    this.logger.log(`Converting image to PDF: ${filename}`);
    
    this.validateImgToPdfOptions(options);

    const fields: Record<string, string | Buffer> = {
      fileInput: imgBuffer,
    };

    if (options.fitOption !== undefined) {
      fields.fitOption = options.fitOption;
    }
    if (options.colorType !== undefined) {
      fields.colorType = options.colorType;
    }
    if (options.autoRotate !== undefined) {
      fields.autoRotate = String(options.autoRotate);
    }
    if (options.pageSize !== undefined) {
      fields.pageSize = options.pageSize;
    }
    if (options.margin !== undefined) {
      fields.margin = String(options.margin);
    }
    if (options.imageQuality !== undefined) {
      fields.quality = String(options.imageQuality);
    }

    return this.makeMultipartRequest('/api/v1/convert/img/pdf', fields, filename);
  }

  private validateImgToPdfOptions(options: ConvertImgToPdfOptions): void {
    const validFitOptions: FitOption[] = ['contain', 'cover', 'fill', 'none'];
    if (options.fitOption !== undefined && !validFitOptions.includes(options.fitOption)) {
      throw new Error(`无效的 fitOption: ${options.fitOption}。支持的值: ${validFitOptions.join(', ')}
        - contain: 完整显示图片，可能有白边
        - cover: 图片填满页面，可能被裁剪
        - fill: 拉伸图片填满页面
        - none: 原始尺寸`);
    }

    const validColorTypes: PdfColorType[] = ['rgb', 'cmyk', 'grayscale', 'monochrome'];
    if (options.colorType !== undefined && !validColorTypes.includes(options.colorType)) {
      throw new Error(`无效的 colorType: ${options.colorType}。支持的值: ${validColorTypes.join(', ')}
        - rgb: 彩色 RGB
        - cmyk: CMYK 印刷色
        - grayscale: 灰度
        - monochrome: 单色`);
    }

    if (options.autoRotate !== undefined && typeof options.autoRotate !== 'boolean') {
      throw new Error(`无效的 autoRotate: 必须为布尔类型`);
    }

    if (options.pageSize !== undefined) {
      const validPageSizes = ['A4', 'A3', 'A5', 'Letter', 'Legal', 'Tabloid', 'custom'];
      if (!validPageSizes.includes(options.pageSize) && !/^\d+x\d+$/.test(options.pageSize)) {
        this.logger.warn(`未知的 pageSize: ${options.pageSize}，将使用默认值`);
      }
    }

    if (options.margin !== undefined) {
      if (typeof options.margin !== 'number' || options.margin < 0 || options.margin > 100) {
        throw new Error(`无效的 margin: ${options.margin}。边距必须在 0-100 之间`);
      }
    }

    if (options.imageQuality !== undefined) {
      if (typeof options.imageQuality !== 'number' || options.imageQuality < 1 || options.imageQuality > 100) {
        throw new Error(`无效的 imageQuality: ${options.imageQuality}。质量必须在 1-100 之间`);
      }
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.makeGetRequest('/api/v1/info/status');
      const status = JSON.parse(result.toString());
      return status.status === 'UP';
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`);
      return false;
    }
  }

  private makeMultipartRequest(
    endpoint: string,
    fields: Record<string, string | Buffer>,
    filename: string,
  ): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        const form = new FormData();
        let hasFileField = false;
        for (const [name, value] of Object.entries(fields)) {
          if (Buffer.isBuffer(value)) {
            hasFileField = true;
            const ext = path.extname(filename).toLowerCase();
            let contentType = 'application/octet-stream';
            if (ext === '.pdf') contentType = 'application/pdf';
            else if (['.jpg', '.jpeg', '.jpe'].includes(ext)) contentType = 'image/jpeg';
            else if (ext === '.png') contentType = 'image/png';
            else if (ext === '.tiff' || ext === '.tif') contentType = 'image/tiff';
            else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            else if (ext === '.doc') contentType = 'application/msword';
            const fallbackFilename = filename.replace(/[^ -~]/g, '_') || 'upload';
            form.append(name, value, { filename: fallbackFilename, contentType });
            this.logger.debug(`Added file field: ${name}, filename: ${filename}, size: ${value.length} bytes, type: ${contentType}`);
          } else {
            form.append(name, value);
            this.logger.debug(`Added text field: ${name} = ${value}`);
          }
        }
        console.log(form, 'form')
        if (!hasFileField) {
          reject(new Error('No file field found in request'));
          return;
        }
        const headers = form.getHeaders({ Accept: '*/*' });
        // 
        this.logger.log(`Sending request to: ${this.config.baseUrl}${normalizedEndpoint}`);
        const res = await this.client.post(normalizedEndpoint, form, { headers });
        const buffer = Buffer.from(res.data);
        this.logger.debug(`Response status: ${res.status}`);
        if (res.status >= 200 && res.status < 300) {
          this.logger.log(`Request successful, response size: ${buffer.length} bytes`);
          resolve(buffer);
        } else {
          const status = res.status;
          const text = buffer.toString('utf-8');
          if (status === 400) reject(new Error(`Stirling-PDF 参数错误: 请确认字段名和必填参数。详情: ${text}`));
          else if (status === 404) reject(new Error(`Stirling-PDF API 路径错误: ${normalizedEndpoint}`));
          else if (status === 415) reject(new Error(`不支持的文件类型，请确保上传 PDF 文件`));
          else if (status === 500) reject(new Error(`Stirling-PDF 转换失败: 服务器内部错误`));
          else reject(new Error(`Stirling-PDF returned ${status}: ${text}`));
        }
      } catch (error: any) {
        if (error?.code === 'ECONNREFUSED') {
          reject(new Error(`无法连接到 Stirling-PDF: ${this.config.baseUrl}。请确认服务是否已启动`));
        } else if (error?.code === 'ETIMEDOUT' || error?.code === 'ESOCKETTIMEDOUT') {
          reject(new Error(`连接 Stirling-PDF 超时 (${this.config.timeout}ms)`));
        } else if (error?.code === 'ECONNRESET') {
          reject(new Error(`连接被重置，可能是服务端问题`));
        } else if (error?.response) {
          const status = error.response.status;
          reject(new Error(`Stirling-PDF returned ${status}`));
        } else {
          reject(new Error(`请求失败: ${error.message}`));
        }
      }
    });
  }

  private makeGetRequest(endpoint: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        const res = await this.client.get(normalizedEndpoint, { headers: { Accept: 'application/json' } });
        const buffer = Buffer.from(res.data);
        if (res.status >= 200 && res.status < 300) {
          resolve(buffer);
        } else {
          reject(new Error(`Stirling-PDF returned ${res.status}`));
        }
      } catch (error: any) {
        reject(error);
      }
    });
  }
}
