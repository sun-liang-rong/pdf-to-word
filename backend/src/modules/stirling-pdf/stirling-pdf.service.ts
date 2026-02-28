/**
 * Stirling-PDF 服务
 * 封装与 Stirling-PDF API 的通信逻辑，提供各种文件转换功能
 * 
 * Stirling-PDF 是一个开源的 PDF 处理服务，提供以下功能：
 * - PDF 转 Word/图片
 * - Word/图片 转 PDF
 * - PDF 合并/拆分
 * - OCR 识别
 */
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
  PdfColorType,
  MergePdfOptions,
  MergeSortType,
  CompressPdfOptions,
  RemovePagesOptions,
  SplitPagesOptions,
  RearrangePagesOptions
} from './stirling-pdf.interface';

@Injectable()
export class StirlingPdfService {
  private readonly logger = new Logger(StirlingPdfService.name);
  private readonly config: StirlingPdfConfig;
  private readonly client: AxiosInstance;

  constructor(private configService: ConfigService) {
    // 初始化 Stirling-PDF 服务配置
    this.config = {
      baseUrl: this.configService.get('STIRLING_PDF_URL') || 'http://localhost:8080',
      timeout: parseInt(this.configService.get('STIRLING_PDF_TIMEOUT') || '300000', 10), // 默认5分钟超时
    };
    this.logger.log(`Stirling-PDF Service initialized: ${this.config.baseUrl}`);
    
    // 创建 axios 实例，配置基础设置
    const baseUrl = this.config.baseUrl.replace(/\/+$/, '');
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: this.config.timeout,
      headers: {
        'User-Agent': 'NestJS-StirlingPDF-Client/1.0',
      },
      responseType: 'arraybuffer',  // 接收二进制数据
      maxContentLength: Infinity as any,
      maxBodyLength: Infinity as any,
      validateStatus: () => true,   // 不自动抛出HTTP错误，手动处理
    });
  }

  /**
   * PDF 转 Word
   * 直接调用 Stirling-PDF 的转换接口，不进行 OCR 处理
   * 
   * @param pdfBuffer - PDF 文件缓冲区
   * @param filename - 文件名
   * @param options - 转换选项（输出格式：doc/docx）
   * @returns 转换后的 Word 文件缓冲区
   */
  async convertPdfToWord(
    pdfBuffer: Buffer,
    filename: string,
    options: ConvertPdfToWordOptions = {},
  ): Promise<Buffer> {
    this.logger.log(`Converting PDF to Word: ${filename}`);
    
    const fields: Record<string, string | Buffer> = { 
      fileInput: pdfBuffer, 
      outputFormat: options.outputFormat || 'doc' 
    };

    return this.makeMultipartRequest('/api/v1/convert/pdf/word', fields, filename);
  }

  /**
   * OCR 识别 PDF
   * 对扫描版 PDF 进行文字识别，生成可搜索的 PDF
   * 
   * @param pdfBuffer - PDF 文件缓冲区
   * @param filename - 文件名
   * @param options - OCR 选项
   * @returns OCR 处理后的 PDF 文件缓冲区
   */
  async ocrPdf(
    pdfBuffer: Buffer,
    filename: string,
    options: OcrPdfOptions = {},
  ): Promise<Buffer> {
    const fields: Record<string, string | Buffer> = {
      fileInput: pdfBuffer,
      languages: options.languages || 'chi_sim+eng',  // 默认中英文
      sidecar: String(options.sidecar ?? false),       // 是否生成文本文件
      deskew: String(options.deskew ?? true),          // 自动校正倾斜
      clean: String(options.clean ?? false),           // 清理噪点
      cleanFinal: String(options.cleanFinal ?? true),
      ocrType: options.ocrType || 'auto',              // OCR 类型：auto/force/skip
      ocrRenderType: options.ocrRenderType || 'searchable', // 渲染类型
    };
    return this.makeMultipartRequest('/api/v1/ocr/pdf', fields, filename);
  }

  /**
   * 检测 PDF 是否包含文本层
   * 通过解析 PDF 结构判断是否为扫描件
   * 
   * 检测方法：
   * - BT...ET: PDF 文本块标记
   * - /Font/Tf: 字体定义
   * - Tj/TJ: 文本显示操作符
   * 
   * @param pdfBuffer - PDF 文件缓冲区
   * @returns 是否包含文本层
   */
  private pdfHasText(pdfBuffer: Buffer): boolean {
    try {
      // 只检查前 256KB，提高性能
      const slice = pdfBuffer.subarray(0, Math.min(pdfBuffer.length, 256 * 1024)).toString('latin1');
      const hasBTET = /BT[\s\S]*?ET/.test(slice);      // 文本块
      const hasFont = /\/Font|Tf\b/.test(slice);       // 字体
      const hasTextShow = /Tj|TJ|\((?:\\\)|[^)])+\)\s*Tj/.test(slice); // 文本显示
      return hasBTET || hasFont || hasTextShow;
    } catch {
      return false;
    }
  }

  /**
   * 智能 PDF 转 Word
   * 自动检测 PDF 是否为扫描件，如果是则先进行 OCR 再转换
   * 
   * 流程：
   * 1. 检测 PDF 是否包含文本层
   * 2. 如果没有文本层（扫描件），先进行 OCR
   * 3. 将处理后的 PDF 转换为 Word
   * 
   * @param pdfBuffer - PDF 文件缓冲区
   * @param filename - 文件名
   * @param options - 转换选项
   * @returns 转换后的 Word 文件缓冲区
   */
  async convertPdfToWordSmart(
    pdfBuffer: Buffer,
    filename: string,
    options: SmartPdfToWordOptions = {},
  ): Promise<Buffer> {
    const enableOcr = options.enableOcr ?? true;
    let sourceBuffer = pdfBuffer;

    // 如果启用 OCR 且 PDF 没有文本层，则先进行 OCR
    if (enableOcr && !this.pdfHasText(pdfBuffer)) {
      this.logger.log('PDF appears image-only. Running OCR before conversion...');
      try {
        sourceBuffer = await this.ocrPdf(pdfBuffer, filename, options.ocr);
      } catch (err: any) {
        // OCR 失败时继续使用原始文件
        this.logger.warn(`OCR step failed (${err?.message}). Proceeding without OCR.`);
        sourceBuffer = pdfBuffer;
      }
    }

    return this.convertPdfToWord(sourceBuffer, filename, { outputFormat: options.outputFormat || 'doc' });
  }

  /**
   * 文件转 PDF
   * 支持将 Word、图片等文件转换为 PDF
   * 
   * @param fileBuffer - 文件缓冲区
   * @param filename - 文件名
   * @param options - 转换选项
   * @returns 转换后的 PDF 文件缓冲区
   */
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

  /**
   * PDF 转图片
   * 将 PDF 的指定页面转换为图片
   * 
   * @param pdfBuffer - PDF 文件缓冲区
   * @param filename - 文件名
   * @param options - 转换选项
   * @returns 转换后的图片文件缓冲区（可能是 ZIP 压缩包）
   */
  async convertPdfToImg(
    pdfBuffer: Buffer,
    filename: string,
    options: ConvertPdfToImgOptions = {},
  ): Promise<Buffer> {
    this.logger.log(`Converting PDF to image: ${filename}`);
    
    // 验证参数
    this.validatePdfToImgOptions(options);

    const fields: Record<string, string | Buffer> = {};

    // 支持使用服务器文件 ID 或直接上传文件
    if (options.fileId) {
      fields.fileId = options.fileId;
    } else if (pdfBuffer) {
      fields.fileInput = pdfBuffer;
    } else {
      throw new Error('必须提供 fileInput (PDF文件) 或 fileId (服务器文件ID)');
    }

    // 设置转换参数
    fields.pageNumbers = options.pageNumbers || 'all';           // 页码范围
    fields.imageFormat = options.imageFormat || 'jpeg';          // 输出格式
    fields.singleOrMultiple = options.singleOrMultiple || 'multiple'; // 单张或多张
    fields.colorType = options.colorType || 'color';             // 颜色模式
    fields.dpi = String(options.dpi || 150);                     // 分辨率
    fields.includeAnnotations = String(options.includeAnnotations ?? false);

    return this.makeMultipartRequest('/api/v1/convert/pdf/img', fields, filename);
  }

  /**
   * 验证 PDF 转图片的参数
   * 
   * @param options - 转换选项
   * @throws Error 如果参数无效
   */
  private validatePdfToImgOptions(options: ConvertPdfToImgOptions): void {
    // fileInput 和 fileId 不能同时使用
    if (options.fileInput && options.fileId) {
      throw new Error('fileInput 和 fileId 不能同时使用，请只选择其中一个');
    }

    // 验证页码格式
    if (options.pageNumbers) {
      const validPagePatterns = [
        /^(\d+,)*\d+$/,        // 单页：1,3,5
        /^\d+-\d+$/,           // 范围：5-9
        /^all$/,               // 全部
        /^(\d+n[\+\-]\d+)$/,   // 函数：2n+1
        /^(\d+n)$/,            // 函数：3n
      ];
      const isValid = validPagePatterns.some(pattern => pattern.test(options.pageNumbers!));
      if (!isValid) {
        throw new Error(`无效的 pageNumbers 格式: ${options.pageNumbers}。支持的格式: 单页(1,3,5)、范围(5-9)、all、函数(2n+1, 3n, 6n-5)`);
      }
    }

    // 验证图片格式
    const validImageFormats: ImageFormat[] = ['jpeg', 'png', 'tiff', 'gif', 'bmp', 'webp'];
    if (options.imageFormat && !validImageFormats.includes(options.imageFormat)) {
      throw new Error(`无效的 imageFormat: ${options.imageFormat}。支持的格式: ${validImageFormats.join(', ')}`);
    }

    // 验证输出模式
    const validSingleOrMultiple: SingleOrMultiple[] = ['single', 'multiple'];
    if (options.singleOrMultiple && !validSingleOrMultiple.includes(options.singleOrMultiple)) {
      throw new Error(`无效的 singleOrMultiple: ${options.singleOrMultiple}。支持的值: single, multiple`);
    }

    // 验证颜色模式
    const validColorTypes: ColorType[] = ['color', 'grayscale', 'blackwhite'];
    if (options.colorType && !validColorTypes.includes(options.colorType)) {
      throw new Error(`无效的 colorType: ${options.colorType}。支持的值: color, grayscale, blackwhite`);
    }

    // 验证 DPI 范围
    if (options.dpi !== undefined) {
      if (!Number.isInteger(options.dpi) || options.dpi < 72 || options.dpi > 600) {
        throw new Error(`无效的 DPI: ${options.dpi}。DPI 必须在 72-600 之间`);
      }
    }

    // 验证 fileId 类型
    if (options.fileId !== undefined && typeof options.fileId !== 'string') {
      throw new Error(`无效的 fileId: 必须为字符串类型`);
    }
  }

  /**
   * 图片转 PDF
   * 将图片文件转换为 PDF
   * 
   * @param imgBuffer - 图片文件缓冲区
   * @param filename - 文件名
   * @param options - 转换选项
   * @returns 转换后的 PDF 文件缓冲区
   */
  async convertImgToPdf(
    imgBuffer: Buffer,
    filename: string,
    options: ConvertImgToPdfOptions = {},
  ): Promise<Buffer> {
    this.logger.log(`Converting image to PDF: ${filename}`);
    
    // 验证参数
    this.validateImgToPdfOptions(options);

    const fields: Record<string, string | Buffer> = {
      fileInput: imgBuffer,
    };

    // 设置可选参数
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

  /**
   * 验证图片转 PDF 的参数
   * 
   * @param options - 转换选项
   * @throws Error 如果参数无效
   */
  private validateImgToPdfOptions(options: ConvertImgToPdfOptions): void {
    // 验证适应模式
    const validFitOptions: FitOption[] = ['contain', 'cover', 'fill', 'none'];
    if (options.fitOption !== undefined && !validFitOptions.includes(options.fitOption)) {
      throw new Error(`无效的 fitOption: ${options.fitOption}。支持的值: ${validFitOptions.join(', ')}
        - contain: 完整显示图片，可能有白边
        - cover: 图片填满页面，可能被裁剪
        - fill: 拉伸图片填满页面
        - none: 原始尺寸`);
    }

    // 验证颜色模式
    const validColorTypes: PdfColorType[] = ['rgb', 'cmyk', 'grayscale', 'monochrome'];
    if (options.colorType !== undefined && !validColorTypes.includes(options.colorType)) {
      throw new Error(`无效的 colorType: ${options.colorType}。支持的值: ${validColorTypes.join(', ')}
        - rgb: 彩色 RGB
        - cmyk: CMYK 印刷色
        - grayscale: 灰度
        - monochrome: 单色`);
    }

    // 验证自动旋转
    if (options.autoRotate !== undefined && typeof options.autoRotate !== 'boolean') {
      throw new Error(`无效的 autoRotate: 必须为布尔类型`);
    }

    // 验证页面大小
    if (options.pageSize !== undefined) {
      const validPageSizes = ['A4', 'A3', 'A5', 'Letter', 'Legal', 'Tabloid', 'custom'];
      if (!validPageSizes.includes(options.pageSize) && !/^\d+x\d+$/.test(options.pageSize)) {
        this.logger.warn(`未知的 pageSize: ${options.pageSize}，将使用默认值`);
      }
    }

    // 验证边距
    if (options.margin !== undefined) {
      if (typeof options.margin !== 'number' || options.margin < 0 || options.margin > 100) {
        throw new Error(`无效的 margin: ${options.margin}。边距必须在 0-100 之间`);
      }
    }

    // 验证图片质量
    if (options.imageQuality !== undefined) {
      if (typeof options.imageQuality !== 'number' || options.imageQuality < 1 || options.imageQuality > 100) {
        throw new Error(`无效的 imageQuality: ${options.imageQuality}。质量必须在 1-100 之间`);
      }
    }
  }

  /**
   * 合并多个 PDF 文件
   * 
   * @param files - PDF 文件数组（包含 buffer 和 filename）
   * @param options - 合并选项
   * @returns 合并后的 PDF 文件缓冲区
   */
  async mergePdfs(
    files: Array<{ buffer: Buffer; filename: string }>,
    options: MergePdfOptions = {},
  ): Promise<Buffer> {
    this.logger.log(`Merging ${files.length} PDF files`);
    
    // 至少需要2个文件
    if (files.length < 2) {
      throw new Error('至少需要2个PDF文件才能合并');
    }

    // 验证参数
    this.validateMergePdfOptions(options);

    return this.makeMultiFileMultipartRequest(
      '/api/v1/general/merge-pdfs',
      files,
      {
        sortType: options.sortType,
        removeCertSign: String(options.removeCertSign ?? false),
        generateToc: String(options.generateToc ?? false),
        ...(options.clientFileIds && { clientFileIds: options.clientFileIds.join(',') }),
      }
    );
  }

  /**
   * 验证 PDF 合并的参数
   * 
   * @param options - 合并选项
   * @throws Error 如果参数无效
   */
  private validateMergePdfOptions(options: MergePdfOptions): void {
    // 验证排序类型
    const validSortTypes: MergeSortType[] = [
      'order', 'reverseOrder', 'byName', 'byNameReverse', 'byDate', 'byDateReverse'
    ];
    if (options.sortType !== undefined && !validSortTypes.includes(options.sortType)) {
      throw new Error(`无效的 sortType: ${options.sortType}。支持的值: ${validSortTypes.join(', ')}`);
    }

    // 验证去除签名选项
    if (options.removeCertSign !== undefined && typeof options.removeCertSign !== 'boolean') {
      throw new Error('removeCertSign 必须为布尔类型');
    }

    // 验证生成目录选项
    if (options.generateToc !== undefined && typeof options.generateToc !== 'boolean') {
      throw new Error('generateToc 必须为布尔类型');
    }

    // 验证文件 ID 数组
    if (options.clientFileIds !== undefined && !Array.isArray(options.clientFileIds)) {
      throw new Error('clientFileIds 必须为数组类型');
    }
  }

  /**
   * 压缩 PDF 文件
   * 支持多种压缩选项，包括优化等级、线性化、灰度化、线稿转换等
   * 
   * @param pdfBuffer - PDF 文件缓冲区
   * @param filename - 文件名
   * @param options - 压缩选项
   * @returns 压缩后的 PDF 文件缓冲区
   */
  async compressPdf(
    pdfBuffer: Buffer,
    filename: string,
    options: CompressPdfOptions,
  ): Promise<Buffer> {
    this.logger.log(`Compressing PDF: ${filename}, optimizeLevel: ${options.optimizeLevel}`);
    
    // 验证参数
    this.validateCompressPdfOptions(options);

    const fields: Record<string, string | Buffer> = {
      fileInput: pdfBuffer,
      optimizeLevel: String(options.optimizeLevel),
    };

    // 添加可选参数
    if (options.expectedOutputSize) {
      fields.expectedOutputSize = options.expectedOutputSize;
    }
    if (options.linearize !== undefined) {
      fields.linearize = String(options.linearize);
    }
    if (options.normalize !== undefined) {
      fields.normalize = String(options.normalize);
    }
    if (options.grayscale !== undefined) {
      fields.grayscale = String(options.grayscale);
    }
    if (options.lineArt !== undefined) {
      fields.lineArt = String(options.lineArt);
    }
    if (options.lineArtThreshold !== undefined) {
      fields.lineArtThreshold = String(options.lineArtThreshold);
    }
    if (options.lineArtEdgeLevel !== undefined) {
      fields.lineArtEdgeLevel = String(options.lineArtEdgeLevel);
    }

    return this.makeMultipartRequest('/api/v1/misc/compress-pdf', fields, filename);
  }

  /**
   * 验证 PDF 压缩的参数
   * 
   * @param options - 压缩选项
   * @throws Error 如果参数无效
   */
  private validateCompressPdfOptions(options: CompressPdfOptions): void {
    // 验证优化等级（必填）
    if (options.optimizeLevel === undefined || options.optimizeLevel === null) {
      throw new Error('optimizeLevel 是必填参数');
    }
    if (!Number.isInteger(options.optimizeLevel) || options.optimizeLevel < 1) {
      throw new Error(`无效的 optimizeLevel: ${options.optimizeLevel}。必须是大于0的整数`);
    }

    // 验证期望输出大小格式
    if (options.expectedOutputSize) {
      const validSizePattern = /^\d+(KB|MB|GB)$/i;
      if (!validSizePattern.test(options.expectedOutputSize)) {
        throw new Error(`无效的 expectedOutputSize: ${options.expectedOutputSize}。格式如: '100MB', '500KB'`);
      }
    }

    // 验证布尔类型参数
    const booleanFields = ['linearize', 'normalize', 'grayscale', 'lineArt'] as const;
    for (const field of booleanFields) {
      if (options[field] !== undefined && typeof options[field] !== 'boolean') {
        throw new Error(`${field} 必须为布尔类型`);
      }
    }

    // 验证线稿阈值
    if (options.lineArtThreshold !== undefined) {
      if (!Number.isInteger(options.lineArtThreshold) || 
          options.lineArtThreshold < 0 || 
          options.lineArtThreshold > 100) {
        throw new Error(`无效的 lineArtThreshold: ${options.lineArtThreshold}。必须在 0-100 之间`);
      }
    }

    // 验证边缘检测强度
    if (options.lineArtEdgeLevel !== undefined) {
      if (!Number.isInteger(options.lineArtEdgeLevel) || 
          options.lineArtEdgeLevel < 1 || 
          options.lineArtEdgeLevel > 3) {
        throw new Error(`无效的 lineArtEdgeLevel: ${options.lineArtEdgeLevel}。必须在 1-3 之间`);
      }
    }
  }

  /**
   * 删除 PDF 指定页面
   * 根据页面表达式删除PDF中的指定页面
   * 
   * @param pdfBuffer - PDF 文件缓冲区
   * @param filename - 文件名
   * @param options - 删除页面选项
   * @returns 删除页面后的 PDF 文件缓冲区
   */
  async removePages(
    pdfBuffer: Buffer,
    filename: string,
    options: RemovePagesOptions,
  ): Promise<Buffer> {
    this.logger.log(`Removing pages from PDF: ${filename}, pages: ${options.pageNumbers}`);
    
    // 验证参数
    this.validateRemovePagesOptions(options);

    const fields: Record<string, string | Buffer> = {
      fileInput: pdfBuffer,
      pageNumbers: options.pageNumbers,
    };

    return this.makeMultipartRequest('/api/v1/general/remove-pages', fields, filename);
  }

  /**
   * 验证删除页面参数
   * 
   * @param options - 删除页面选项
   * @throws Error 如果参数无效
   */
  private validateRemovePagesOptions(options: RemovePagesOptions): void {
    if (!options.pageNumbers || options.pageNumbers.trim() === '') {
      throw new Error('pageNumbers 是必填参数');
    }

    // 验证页面表达式格式
    const validPatterns = [
      /^(\d+,)*\d+$/,           // 单页：1,3,5
      /^\d+-\d+$/,              // 范围：2-6
      /^(\d+,)*(\d+-\d+,)*\d+$/, // 组合：1,3-5,8
      /^all$/i,                 // 全部
      /^\d*n$/,                 // 函数：2n, 3n
      /^\d*n[\+\-]\d+$/,        // 函数：2n+1, 6n-5
    ];

    const isValid = validPatterns.some(pattern => pattern.test(options.pageNumbers.trim()));
    if (!isValid) {
      throw new Error(
        `无效的 pageNumbers 格式: ${options.pageNumbers}。` +
        `支持的格式: 单页(1,3,5)、范围(2-6)、组合(1,3-5,8)、all、函数(2n, 2n+1, 6n-5)`
      );
    }
  }

  /**
   * 拆分 PDF 页面
   * 根据页面表达式将 PDF 拆分成多个独立的文件
   * 
   * @param pdfBuffer - PDF 文件缓冲区
   * @param filename - 文件名
   * @param options - 拆分页面选项
   * @returns 拆分后的文件缓冲区（可能是 ZIP 压缩包或多个 PDF）
   */
  async splitPages(
    pdfBuffer: Buffer,
    filename: string,
    options: SplitPagesOptions,
  ): Promise<Buffer> {
    this.logger.log(`Splitting PDF: ${filename}, pages: ${options.pageNumbers}, mergeAll: ${options.mergeAll}`);
    
    // 验证参数
    this.validateSplitPagesOptions(options);

    const fields: Record<string, string | Buffer> = {
      fileInput: pdfBuffer,
      pageNumbers: options.pageNumbers,
    };

    // 如果启用合并，使用 remove-pages 接口提取指定页面并合并为一个文件
    if (options.mergeAll) {
      this.logger.log(`Using remove-pages API to extract and merge pages`);
      return this.makeMultipartRequest('/api/v1/general/remove-pages', fields, filename);
    }

    // 否则使用 split-pages 接口拆分成多个文件
    return this.makeMultipartRequest('/api/v1/general/split-pages', fields, filename);
  }

  /**
   * 验证拆分页面参数
   * 
   * @param options - 拆分页面选项
   * @throws Error 如果参数无效
   */
  private validateSplitPagesOptions(options: SplitPagesOptions): void {
    if (!options.pageNumbers || options.pageNumbers.trim() === '') {
      throw new Error('pageNumbers 是必填参数');
    }

    // 验证页面表达式格式（与 remove-pages 相同）
    const validPatterns = [
      /^(\d+,)*\d+$/,           // 单页：1,3,5
      /^\d+-\d+$/,              // 范围：2-6
      /^(\d+,)*(\d+-\d+,)*\d+$/, // 组合：1,3-5,8
      /^all$/i,                 // 全部
      /^\d*n$/,                 // 函数：2n, 3n
      /^\d*n[\+\-]\d+$/,        // 函数：2n+1, 6n-5
    ];

    const isValid = validPatterns.some(pattern => pattern.test(options.pageNumbers.trim()));
    if (!isValid) {
      throw new Error(
        `无效的 pageNumbers 格式: ${options.pageNumbers}。` +
        `支持的格式: 单页(1,3,5)、范围(2-6)、组合(1,3-5,8)、all、函数(2n, 2n+1, 6n-5)`
      );
    }
  }

  /**
   * 重新排列 PDF 页面
   * 根据指定的模式和页面顺序重新排列 PDF 页面
   * 
   * @param pdfBuffer - PDF 文件缓冲区
   * @param filename - 文件名
   * @param options - 重新排列页面选项
   * @returns 重新排列后的文件缓冲区
   */
  async rearrangePages(
    pdfBuffer: Buffer,
    filename: string,
    options: RearrangePagesOptions,
  ): Promise<Buffer> {
    this.logger.log(`Rearranging PDF: ${filename}, mode: ${options.customMode}, pages: ${options.pageNumbers}`);
    
    // 验证参数
    this.validateRearrangePagesOptions(options);

    const fields: Record<string, string | Buffer> = {
      fileInput: pdfBuffer,
      pageNumbers: options.pageNumbers,
      customMode: options.customMode,
    };

    return this.makeMultipartRequest('/api/v1/general/rearrange-pages', fields, filename);
  }

  /**
   * 验证重新排列页面参数
   * 
   * @param options - 重新排列页面选项
   * @throws Error 如果参数无效
   */
  private validateRearrangePagesOptions(options: RearrangePagesOptions): void {
    if (!options.pageNumbers || options.pageNumbers.trim() === '') {
      throw new Error('pageNumbers 是必填参数');
    }

    const validModes = [
      'CUSTOM',
      'REVERSE_ORDER',
      'DUPLICATE',
      'DUPLEX_SORT',
      'BOOKLET_SORT',
      'ODD_EVEN_SPLIT',
      'ODD_EVEN_MERGE',
      'REMOVE_FIRST',
      'REMOVE_LAST',
      'REMOVE_FIRST_AND_LAST',
    ];

    if (!validModes.includes(options.customMode)) {
      throw new Error(
        `无效的 customMode: ${options.customMode}。` +
        `支持的模式: ${validModes.join(', ')}`
      );
    }

    // CUSTOM 模式需要验证 pageNumbers 格式
    if (options.customMode === 'CUSTOM') {
      const validPatterns = [
        /^(\d+,)*\d+$/,           // 单页：1,3,5
        /^\d+-\d+$/,              // 范围：2-6
        /^(\d+,)*(\d+-\d+,)*\d+$/, // 组合：1,3-5,8
      ];

      const isValid = validPatterns.some(pattern => pattern.test(options.pageNumbers.trim()));
      if (!isValid) {
        throw new Error(
          `CUSTOM 模式下无效的 pageNumbers 格式: ${options.pageNumbers}。` +
          `支持的格式: 单页(1,3,5)、范围(2-6)、组合(1,3-5,8)`
        );
      }
    }
  }

  /**
   * 健康检查
   * 检查 Stirling-PDF 服务是否可用
   * 
   * @returns 服务是否正常
   */
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

  /**
   * 发送单文件 Multipart 请求
   * 构建表单数据并发送到 Stirling-PDF API
   * 
   * @param endpoint - API 端点
   * @param fields - 表单字段（文件和参数）
   * @param filename - 文件名（用于设置 Content-Type）
   * @returns 响应数据缓冲区
   */
  private makeMultipartRequest(
    endpoint: string,
    fields: Record<string, string | Buffer>,
    filename: string,
  ): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        // 规范化端点路径
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        const form = new FormData();
        let hasFileField = false;

        // 遍历字段，添加到表单
        for (const [name, value] of Object.entries(fields)) {
          if (Buffer.isBuffer(value)) {
            // 文件字段：设置正确的 Content-Type
            hasFileField = true;
            const ext = path.extname(filename).toLowerCase();
            let contentType = 'application/octet-stream';
            if (ext === '.pdf') contentType = 'application/pdf';
            else if (['.jpg', '.jpeg', '.jpe'].includes(ext)) contentType = 'image/jpeg';
            else if (ext === '.png') contentType = 'image/png';
            else if (ext === '.tiff' || ext === '.tif') contentType = 'image/tiff';
            else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            else if (ext === '.doc') contentType = 'application/msword';
            
            // 处理中文文件名：替换非 ASCII 字符
            const fallbackFilename = filename.replace(/[^ -~]/g, '_') || 'upload';
            form.append(name, value, { filename: fallbackFilename, contentType });
            this.logger.debug(`Added file field: ${name}, filename: ${filename}, size: ${value.length} bytes, type: ${contentType}`);
          } else {
            // 文本字段
            form.append(name, value);
            this.logger.debug(`Added text field: ${name} = ${value}`);
          }
        }

        // 确保有文件字段
        if (!hasFileField) {
          reject(new Error('No file field found in request'));
          return;
        }

        // 发送请求
        const headers = form.getHeaders({ Accept: '*/*' });
        this.logger.log(`Sending request to: ${this.config.baseUrl}${normalizedEndpoint}`);
        const res = await this.client.post(normalizedEndpoint, form, { headers });
        const buffer = Buffer.from(res.data);
        this.logger.debug(`Response status: ${res.status}`);

        // 处理响应
        if (res.status >= 200 && res.status < 300) {
          this.logger.log(`Request successful, response size: ${buffer.length} bytes`);
          resolve(buffer);
        } else {
          // 根据状态码返回友好的错误信息
          const status = res.status;
          const text = buffer.toString('utf-8');
          if (status === 400) reject(new Error(`Stirling-PDF 参数错误: 请确认字段名和必填参数。详情: ${text}`));
          else if (status === 404) reject(new Error(`Stirling-PDF API 路径错误: ${normalizedEndpoint}`));
          else if (status === 415) reject(new Error(`不支持的文件类型，请确保上传 PDF 文件`));
          else if (status === 500) reject(new Error(`Stirling-PDF 转换失败: 服务器内部错误`));
          else reject(new Error(`Stirling-PDF returned ${status}: ${text}`));
        }
      } catch (error: any) {
        // 处理网络错误
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

  /**
   * 发送 GET 请求
   * 用于健康检查等不需要上传文件的场景
   * 
   * @param endpoint - API 端点
   * @returns 响应数据缓冲区
   */
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

  /**
   * 发送多文件 Multipart 请求
   * 用于 PDF 合并等需要上传多个文件的场景
   * 
   * @param endpoint - API 端点
   * @param files - 文件数组
   * @param options - 额外选项
   * @returns 响应数据缓冲区
   */
  private makeMultiFileMultipartRequest(
    endpoint: string,
    files: Array<{ buffer: Buffer; filename: string }>,
    options: Record<string, string> = {},
  ): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        const form = new FormData();

        // 添加所有文件（使用相同的字段名 fileInput）
        for (const file of files) {
          const ext = path.extname(file.filename).toLowerCase();
          let contentType = 'application/pdf';
          if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
          else if (ext === '.png') contentType = 'image/png';
          
          const fallbackFilename = file.filename.replace(/[^ -~]/g, '_') || 'upload.pdf';
          form.append('fileInput', file.buffer, { filename: fallbackFilename, contentType });
          this.logger.debug(`Added file: ${file.filename}, size: ${file.buffer.length} bytes`);
        }

        // 添加选项参数
        for (const [name, value] of Object.entries(options)) {
          if (value !== undefined) {
            form.append(name, value);
            this.logger.debug(`Added option: ${name} = ${value}`);
          }
        }

        // 发送请求
        const headers = form.getHeaders({ Accept: '*/*' });
        this.logger.log(`Sending multi-file request to: ${this.config.baseUrl}${normalizedEndpoint}`);
        
        const res = await this.client.post(normalizedEndpoint, form, { headers });
        const buffer = Buffer.from(res.data);
        
        // 处理响应
        if (res.status >= 200 && res.status < 300) {
          this.logger.log(`Merge successful, response size: ${buffer.length} bytes`);
          resolve(buffer);
        } else {
          const text = buffer.toString('utf-8');
          if (res.status === 400) reject(new Error(`参数错误: ${text}`));
          else if (res.status === 500) reject(new Error(`服务器内部错误: ${text}`));
          else reject(new Error(`Stirling-PDF returned ${res.status}: ${text}`));
        }
      } catch (error: any) {
        // 处理网络错误
        if (error?.code === 'ECONNREFUSED') {
          reject(new Error(`无法连接到 Stirling-PDF: ${this.config.baseUrl}`));
        } else if (error?.code === 'ETIMEDOUT') {
          reject(new Error(`连接超时 (${this.config.timeout}ms)`));
        } else {
          reject(new Error(`请求失败: ${error.message}`));
        }
      }
    });
  }
}
