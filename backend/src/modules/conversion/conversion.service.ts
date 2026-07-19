/**
 * 转换服务
 * 核心业务逻辑：处理文件转换请求，调用Stirling-PDF服务完成转换
 */
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { ConversionTask, TaskStatus, ConversionType, OUTPUT_EXTENSIONS } from '../task/task.entity';
import { StirlingPdfService } from '../stirling-pdf/stirling-pdf.service';
import { MergePdfOptions, CompressPdfOptions, RemovePagesOptions, SplitPagesOptions, RearrangePagesOptions, RotatePdfOptions, ExtractPagesOptions, TextWatermarkOptions, OcrPdfOptions, ProtectPdfOptions, SignatureOptions, CropPdfOptions, AddPageNumbersOptions, ScalePagesOptions } from '../stirling-pdf/stirling-pdf.interface';

/**
 * 允许的文件类型映射
 * key: 转换类型
 * value: 允许的MIME类型数组
 */
const ALLOWED_TYPES: Record<string, string[]> = {
  [ConversionType.PDF_TO_WORD]: ['application/pdf'],
  [ConversionType.WORD_TO_PDF]: [
    'application/msword',                                                    // .doc 格式
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx 格式
  ],
  [ConversionType.PDF_TO_JPG]: ['application/pdf'],
  [ConversionType.JPG_TO_PDF]: ['image/jpeg', 'image/png', 'image/jpg'],
  [ConversionType.MERGE_PDF]: ['application/pdf'],
  [ConversionType.COMPRESS_PDF]: ['application/pdf'],
  [ConversionType.REMOVE_PAGES]: ['application/pdf'],
  [ConversionType.SPLIT_PAGES]: ['application/pdf'],
  [ConversionType.ROTATE_PDF]: ['application/pdf'],
  [ConversionType.EXTRACT_PAGES]: ['application/pdf'],
  [ConversionType.PDF_TEXT_WATERMARK]: ['application/pdf'],
};

@Injectable()
export class ConversionService {
  /** 文件上传目录 */
  private uploadDir: string;
  
  /** 最大文件大小（字节） */
  private maxFileSize: number;

  constructor(
    private configService: ConfigService,
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
    private stirlingPdfService: StirlingPdfService,
  ) {
    // 初始化配置
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    this.maxFileSize = parseInt(this.configService.get('MAX_FILE_SIZE') || '20971520', 10); // 默认20MB
    
    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * 创建单文件转换任务
   * 
   * 流程：
   * 1. 验证文件（存在性、大小、类型）
   * 2. 生成任务ID和输出路径
   * 3. 调用Stirling-PDF服务进行转换
   * 4. 保存转换结果到本地
   * 5. 创建数据库记录
   * 
   * @param file - 上传的文件
   * @param type - 转换类型
   * @param ipAddress - 客户端IP地址
   * @returns 转换结果（taskId, status, message）
   */
  async createConversion(
    file: Express.Multer.File,
    type: ConversionType,
    ipAddress: string,
  ) {
    // ========== 步骤1: 文件验证 ==========
    if (!file) {
      throw new BadRequestException('请上传文件');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`文件大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`);
    }

    const allowedMimeTypes = ALLOWED_TYPES[type];
    if (!allowedMimeTypes) {
      throw new BadRequestException('不支持的转换类型');
    }
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('文件类型不支持');
    }

    // ========== 步骤2: 准备任务信息 ==========
    const taskId = uuidv4();
    const normalizedOriginalName = this.normalizeOriginalName(file.originalname);
    const expireMinutes = parseInt(this.configService.get('FILE_EXPIRE_MINUTES') || '30', 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
    const outputExt = OUTPUT_EXTENSIONS[type].replace('.', '');
    const outputPath = path.join(this.uploadDir, `${taskId}.${outputExt}`);

    // ========== 步骤3: 执行转换 ==========
    let outputBuffer: Buffer;
    const filename = normalizedOriginalName;

    // 根据转换类型调用不同的转换方法
    if (type === ConversionType.PDF_TO_WORD) {
      // PDF转Word：启用OCR识别扫描件
      outputBuffer = await this.stirlingPdfService.convertPdfToWordSmart(file.buffer, filename, {
        outputFormat: 'doc',
        enableOcr: true,
        ocr: { languages: this.configService.get('OCR_LANGUAGES') || 'chi_sim+eng' },
      });
    } else if (type === ConversionType.WORD_TO_PDF) {
      // Word转PDF
      outputBuffer = await this.stirlingPdfService.convertFileToPdf(file.buffer, filename);
    } else if (type === ConversionType.PDF_TO_JPG) {
      // PDF转JPG：默认150 DPI
      outputBuffer = await this.stirlingPdfService.convertPdfToImg(file.buffer, filename, {
        imageFormat: 'jpeg',
        dpi: 150,
      });
    } else if (type === ConversionType.JPG_TO_PDF) {
      // 图片转PDF
      outputBuffer = await this.stirlingPdfService.convertImgToPdf(file.buffer, filename);
    } else {
      throw new BadRequestException('不支持的转换类型');
    }

    // ========== 步骤4: 保存输出文件 ==========
    fs.writeFileSync(outputPath, outputBuffer);

    // ========== 步骤5: 创建数据库记录 ==========
    const task = this.taskRepository.create({
      id: taskId,
      originalName: normalizedOriginalName,
      inputPath: '',
      type,
      status: TaskStatus.COMPLETED,
      fileSize: file.size,
      ipAddress,
      expiresAt,
      outputPath,
    });

    await this.taskRepository.save(task);

    return {
      taskId,
      status: TaskStatus.COMPLETED,
      message: '转换完成',
    };
  }

  /**
   * 获取支持的转换工具列表
   * 用于前端展示可用的转换功能
   * 
   * @returns 工具信息数组
   */
  getSupportedTools() {
    return [
      {
        type: ConversionType.PDF_TO_WORD,
        name: 'PDF转Word',
        description: '将PDF文件转换为可编辑的Word文档',
        inputFormats: ['pdf'],
        outputFormat: 'doc',
      },
      {
        type: ConversionType.WORD_TO_PDF,
        name: 'Word转PDF',
        description: '将Word文档转换为PDF格式',
        inputFormats: ['doc', 'docx'],
        outputFormat: 'pdf',
      },
      {
        type: ConversionType.PDF_TO_JPG,
        name: 'PDF转JPG',
        description: '将PDF文件的每一页转换为JPG图片',
        inputFormats: ['pdf'],
        outputFormat: 'jpg',
      },
      {
        type: ConversionType.JPG_TO_PDF,
        name: 'JPG转PDF',
        description: '将JPG/PNG图片转换为PDF文件',
        inputFormats: ['jpg', 'jpeg', 'png'],
        outputFormat: 'pdf',
      },
      {
        type: ConversionType.MERGE_PDF,
        name: 'PDF合并',
        description: '将多个PDF文件合并为一个PDF文件',
        inputFormats: ['pdf'],
        outputFormat: 'pdf',
      },
      {
        type: ConversionType.COMPRESS_PDF,
        name: 'PDF压缩',
        description: '压缩PDF文件大小，支持线性化、灰度化等选项',
        inputFormats: ['pdf'],
        outputFormat: 'pdf',
      },
      {
        type: ConversionType.REMOVE_PAGES,
        name: 'PDF删除页面',
        description: '删除PDF中的指定页面，支持可视化选择或表达式输入',
        inputFormats: ['pdf'],
        outputFormat: 'pdf',
      },
      {
        type: ConversionType.SPLIT_PAGES,
        name: 'PDF拆分页面',
        description: '将PDF文件按页面拆分为多个独立PDF文件，支持可视化选择或表达式输入',
        inputFormats: ['pdf'],
        outputFormat: 'zip',
      },
    ];
  }

  /**
   * 创建PDF压缩任务
   * 
   * 流程：
   * 1. 验证文件
   * 2. 生成任务ID和输出路径
   * 3. 调用Stirling-PDF压缩服务
   * 4. 保存压缩结果
   * 5. 创建数据库记录
   * 
   * @param file - 上传的PDF文件
   * @param options - 压缩选项
   * @param ipAddress - 客户端IP地址
   * @returns 压缩结果（taskId, status, message）
   */
  async createCompressConversion(
    file: Express.Multer.File,
    options: CompressPdfOptions,
    ipAddress: string,
  ) {
    // ========== 步骤1: 文件验证 ==========
    if (!file) {
      throw new BadRequestException('请上传PDF文件');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`文件大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`);
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('只支持PDF文件');
    }

    // ========== 步骤2: 准备任务信息 ==========
    const taskId = uuidv4();
    const normalizedOriginalName = this.normalizeOriginalName(file.originalname);
    const expireMinutes = parseInt(this.configService.get('FILE_EXPIRE_MINUTES') || '30', 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
    const outputPath = path.join(this.uploadDir, `${taskId}.pdf`);

    // ========== 步骤3: 执行压缩 ==========
    const outputBuffer = await this.stirlingPdfService.compressPdf(
      file.buffer,
      normalizedOriginalName,
      options,
    );

    // ========== 步骤4: 保存输出文件 ==========
    fs.writeFileSync(outputPath, outputBuffer);

    // ========== 步骤5: 创建数据库记录 ==========
    const task = this.taskRepository.create({
      id: taskId,
      originalName: normalizedOriginalName,
      inputPath: '',
      type: ConversionType.COMPRESS_PDF,
      status: TaskStatus.COMPLETED,
      fileSize: file.size,
      ipAddress,
      expiresAt,
      outputPath,
    });

    await this.taskRepository.save(task);

    return {
      taskId,
      status: TaskStatus.COMPLETED,
      message: '压缩完成',
    };
  }

  /**
   * 创建删除页面任务
   * 
   * 流程：
   * 1. 验证文件和页面表达式
   * 2. 生成任务 ID 和输出路径
   * 3. 调用 Stirling-PDF 删除页面服务
   * 4. 保存结果
   * 5. 创建数据库记录
   * 
   * @param file - 上传的 PDF 文件
   * @param options - 删除页面选项
   * @param ipAddress - 客户端 IP 地址
   * @returns 删除结果（taskId, status, message）
   */
  async createRemovePagesConversion(
    file: Express.Multer.File,
    options: RemovePagesOptions,
    ipAddress: string,
  ) {
    // ========== 步骤 1: 文件验证 ==========
    if (!file) {
      throw new BadRequestException('请上传 PDF 文件');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`文件大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`);
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('只支持 PDF 文件');
    }

    // ========== 步骤 2: 准备任务信息 ==========
    const taskId = uuidv4();
    const normalizedOriginalName = this.normalizeOriginalName(file.originalname);
    const expireMinutes = parseInt(this.configService.get('FILE_EXPIRE_MINUTES') || '30', 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
    const outputPath = path.join(this.uploadDir, `${taskId}.pdf`);

    // ========== 步骤 3: 执行删除页面 ==========
    const outputBuffer = await this.stirlingPdfService.removePages(
      file.buffer,
      normalizedOriginalName,
      options,
    );

    // ========== 步骤 4: 保存输出文件 ==========
    fs.writeFileSync(outputPath, outputBuffer);

    // ========== 步骤 5: 创建数据库记录 ==========
    const task = this.taskRepository.create({
      id: taskId,
      originalName: normalizedOriginalName,
      inputPath: '',
      type: ConversionType.REMOVE_PAGES,
      status: TaskStatus.COMPLETED,
      fileSize: file.size,
      ipAddress,
      expiresAt,
      outputPath,
    });

    await this.taskRepository.save(task);

    return {
      taskId,
      status: TaskStatus.COMPLETED,
      message: '删除页面完成',
    };
  }

  /**
   * 创建重新排列页面任务
   * 
   * 流程：
   * 1. 验证文件和参数
   * 2. 生成任务 ID 和输出路径
   * 3. 调用 Stirling-PDF 重新排列页面服务
   * 4. 保存结果
   * 5. 创建数据库记录
   * 
   * @param file - 上传的 PDF 文件
   * @param options - 重新排列页面选项
   * @param ipAddress - 客户端 IP 地址
   * @returns 重新排列结果（taskId, status, message）
   */
  async createRearrangePagesConversion(
    file: Express.Multer.File,
    options: RearrangePagesOptions,
    ipAddress: string,
  ) {
    // ========== 步骤 1: 文件验证 ==========
    if (!file) {
      throw new BadRequestException('请上传 PDF 文件');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`文件大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`);
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('只支持 PDF 文件');
    }

    // ========== 步骤 2: 准备任务信息 ==========
    const taskId = uuidv4();
    const normalizedOriginalName = this.normalizeOriginalName(file.originalname);
    const expireMinutes = parseInt(this.configService.get('FILE_EXPIRE_MINUTES') || '30', 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
    const outputPath = path.join(this.uploadDir, `${taskId}.pdf`);

    // ========== 步骤 3: 执行重新排列页面 ==========
    const outputBuffer = await this.stirlingPdfService.rearrangePages(
      file.buffer,
      normalizedOriginalName,
      options,
    );

    // ========== 步骤 4: 保存输出文件 ==========
    fs.writeFileSync(outputPath, outputBuffer);

    // ========== 步骤 5: 创建数据库记录 ==========
    const task = this.taskRepository.create({
      id: taskId,
      originalName: normalizedOriginalName,
      inputPath: '',
      type: ConversionType.REARRANGE_PAGES,
      status: TaskStatus.COMPLETED,
      fileSize: file.size,
      ipAddress,
      expiresAt,
      outputPath,
    });

    await this.taskRepository.save(task);

    return {
      taskId,
      status: TaskStatus.COMPLETED,
      message: '页面重新排列完成',
    };
  }

  /**
   * 创建拆分页面任务
   * 
   * 流程：
   * 1. 验证文件和页面表达式
   * 2. 生成任务 ID 和输出路径
   * 3. 调用 Stirling-PDF 拆分页面服务
   * 4. 保存结果（可能是 ZIP 压缩包）
   * 5. 创建数据库记录
   * 
   * @param file - 上传的 PDF 文件
   * @param options - 拆分页面选项
   * @param ipAddress - 客户端 IP 地址
   * @returns 拆分结果（taskId, status, message）
   */
  async createSplitPagesConversion(
    file: Express.Multer.File,
    options: SplitPagesOptions,
    ipAddress: string,
  ) {
    // ========== 步骤 1: 文件验证 ==========
    if (!file) {
      throw new BadRequestException('请上传 PDF 文件');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`文件大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`);
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('只支持 PDF 文件');
    }

    // ========== 步骤 2: 准备任务信息 ==========
    const taskId = uuidv4();
    const normalizedOriginalName = this.normalizeOriginalName(file.originalname);
    const expireMinutes = parseInt(this.configService.get('FILE_EXPIRE_MINUTES') || '30', 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
    const outputPath = path.join(this.uploadDir, `${taskId}.zip`);

    // ========== 步骤 3: 执行拆分页面 ==========
    const outputBuffer = await this.stirlingPdfService.splitPages(
      file.buffer,
      normalizedOriginalName,
      options,
    );

    // ========== 步骤 4: 保存输出文件 ==========
    fs.writeFileSync(outputPath, outputBuffer);

    // ========== 步骤 5: 创建数据库记录 ==========
    const task = this.taskRepository.create({
      id: taskId,
      originalName: normalizedOriginalName,
      inputPath: '',
      type: ConversionType.SPLIT_PAGES,
      status: TaskStatus.COMPLETED,
      fileSize: file.size,
      ipAddress,
      expiresAt,
      outputPath,
    });

    await this.taskRepository.save(task);

    return {
      taskId,
      status: TaskStatus.COMPLETED,
      message: '拆分页面完成',
    };
  }

  /**
   * 创建 PDF 合并任务
   * 
   * 流程：
   * 1. 验证文件数量和类型
   * 2. 生成任务ID和输出路径
   * 3. 调用Stirling-PDF合并服务
   * 4. 保存合并结果
   * 5. 创建数据库记录
   * 
   * @param files - 上传的多个PDF文件
   * @param options - 合并选项（排序方式、是否去除签名、是否生成目录等）
   * @param ipAddress - 客户端IP地址
   * @returns 合并结果（taskId, status, message）
   */
  async createMergeConversion(
    files: Express.Multer.File[],
    options: MergePdfOptions,
    ipAddress: string,
  ) {
    // ========== 步骤1: 文件验证 ==========
    if (!files || files.length < 2) {
      throw new BadRequestException('至少需要上传2个PDF文件');
    }

    // 验证每个文件的大小和类型
    for (const file of files) {
      if (file.size > this.maxFileSize) {
        throw new BadRequestException(`文件 ${file.originalname} 大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`);
      }
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('只支持PDF文件');
      }
    }

    // ========== 步骤2: 准备任务信息 ==========
    const taskId = uuidv4();
    const expireMinutes = parseInt(this.configService.get('FILE_EXPIRE_MINUTES') || '30', 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
    const outputPath = path.join(this.uploadDir, `${taskId}.pdf`);

    // ========== 步骤3: 执行合并 ==========
    // 构建文件信息数组
    const pdfFiles = files.map(file => ({
      buffer: file.buffer,
      filename: this.normalizeOriginalName(file.originalname),
    }));

    // 调用Stirling-PDF合并服务
    const outputBuffer = await this.stirlingPdfService.mergePdfs(pdfFiles, options);

    // ========== 步骤4: 保存输出文件 ==========
    fs.writeFileSync(outputPath, outputBuffer);

    // ========== 步骤5: 创建数据库记录 ==========
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const task = this.taskRepository.create({
      id: taskId,
      originalName: 'merged.pdf',
      inputPath: '',
      type: ConversionType.MERGE_PDF,
      status: TaskStatus.COMPLETED,
      fileSize: totalSize,
      ipAddress,
      expiresAt,
      outputPath,
    });

    await this.taskRepository.save(task);

    return {
      taskId,
      status: TaskStatus.COMPLETED,
      message: '合并完成',
    };
  }

  async createRotatePdfConversion(file: Express.Multer.File, options: RotatePdfOptions, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.ROTATE_PDF, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.rotatePdf(buffer, filename, options.angle));
  }

  async createExtractPagesConversion(file: Express.Multer.File, options: ExtractPagesOptions, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.EXTRACT_PAGES, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.extractPages(buffer, filename, options.pageNumbers));
  }

  async createTextWatermarkConversion(file: Express.Multer.File, options: TextWatermarkOptions, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.PDF_TEXT_WATERMARK, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.addTextWatermark(buffer, filename, options));
  }

  async createOcrPdfConversion(file: Express.Multer.File, options: OcrPdfOptions, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.OCR_PDF, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.ocrPdf(buffer, filename, options));
  }

  async createProtectPdfConversion(file: Express.Multer.File, options: ProtectPdfOptions, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.PROTECT_PDF, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.addPassword(buffer, filename, options));
  }

  async createUnlockPdfConversion(file: Express.Multer.File, options: { password: string }, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.UNLOCK_PDF, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.removePassword(buffer, filename, options.password));
  }

  async createCropPdfConversion(file: Express.Multer.File, options: CropPdfOptions, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.CROP_PDF, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.cropPdf(buffer, filename, options));
  }

  async createPdfToExcelConversion(file: Express.Multer.File, options: { pageNumbers?: string }, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.PDF_TO_EXCEL, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.convertPdfToExcel(buffer, filename, options.pageNumbers || 'all'));
  }

  async createPdfToPptxConversion(file: Express.Multer.File, _options: object, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.PDF_TO_PPTX, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.convertPdfToPresentation(buffer, filename, 'pptx'));
  }

  async createPdfToHtmlConversion(file: Express.Multer.File, _options: object, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.PDF_TO_HTML, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.convertPdfToHtml(buffer, filename));
  }

  async createAddPageNumbersConversion(file: Express.Multer.File, options: AddPageNumbersOptions, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.ADD_PAGE_NUMBERS, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.addPageNumbers(buffer, filename, options));
  }

  async createScalePdfConversion(file: Express.Multer.File, options: ScalePagesOptions, ipAddress: string) {
    return this.createPdfOperation(file, ConversionType.SCALE_PDF, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.scalePages(buffer, filename, options));
  }

  async createSignatureConversion(file: Express.Multer.File, signature: Express.Multer.File, options: SignatureOptions, ipAddress: string) {
    if (!signature) throw new BadRequestException('请上传签名图片');
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(signature.mimetype)) throw new BadRequestException('签名只支持 PNG、JPG 或 SVG');
    if (signature.size > 5 * 1024 * 1024) throw new BadRequestException('签名图片不能超过 5MB');
    return this.createPdfOperation(file, ConversionType.SIGN_PDF, ipAddress, (buffer, filename) =>
      this.stirlingPdfService.addSignature(buffer, filename, signature.buffer, this.normalizeOriginalName(signature.originalname), options));
  }

  private async createPdfOperation(
    file: Express.Multer.File,
    type: ConversionType,
    ipAddress: string,
    operation: (buffer: Buffer, filename: string) => Promise<Buffer>,
  ) {
    if (!file) throw new BadRequestException('请上传 PDF 文件');
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`文件大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`);
    }
    if (file.mimetype !== 'application/pdf') throw new BadRequestException('只支持 PDF 文件');

    const taskId = uuidv4();
    const originalName = this.normalizeOriginalName(file.originalname);
    const expiresAt = new Date(Date.now() + parseInt(this.configService.get('FILE_EXPIRE_MINUTES') || '30', 10) * 60 * 1000);
    const outputExt = OUTPUT_EXTENSIONS[type].replace('.', '');
    const outputPath = path.join(this.uploadDir, `${taskId}.${outputExt}`);
    const outputBuffer = await operation(file.buffer, originalName);
    if (!outputBuffer.length) {
      throw new BadRequestException('转换未生成有效文件，请确认 PDF 包含可转换的内容');
    }
    fs.writeFileSync(outputPath, outputBuffer);

    try {
      const task = this.taskRepository.create({
        id: taskId, originalName, inputPath: '', type, status: TaskStatus.COMPLETED,
        fileSize: file.size, ipAddress, expiresAt, outputPath,
      });
      await this.taskRepository.save(task);
    } catch (error) {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      throw error;
    }

    return { taskId, status: TaskStatus.COMPLETED, message: '处理完成' };
  }

  /**
   * 规范化原始文件名
   * 处理中文文件名编码问题，解决不同浏览器上传时的编码差异
   * 
   * 检测逻辑：
   * 1. 尝试从latin1解码为utf8
   * 2. 检测解码后是否包含中文字符
   * 3. 检测原始字符串是否包含乱码特征
   * 
   * @param name - 原始文件名
   * @returns 规范化后的文件名
   */
  private normalizeOriginalName(name: string): string {
    try {
      // 尝试从latin1解码为utf8（处理某些浏览器上传中文文件名时的编码问题）
      const decoded = Buffer.from(name, 'latin1').toString('utf8');
      
      // 检测各种编码异常特征
      const hasCJKDecoded = /[\u4e00-\u9fff]/.test(decoded);      // 解码后是否有中文
      const hasCJKOriginal = /[\u4e00-\u9fff]/.test(name);        // 原始是否有中文
      const hasReplacementChar = /�/.test(name);                   // 是否有替换字符
      const hasMojibakeHints = /Ã|Â|æ|ä|å|Ê|È|¼|½/.test(name);    // 是否有乱码特征
      
      // 如果解码后出现中文但原始没有，或者有乱码特征，则使用解码后的名称
      if ((hasCJKDecoded && !hasCJKOriginal) || hasReplacementChar || hasMojibakeHints) {
        return decoded;
      }
      return name;
    } catch {
      return name;
    }
  }
}
