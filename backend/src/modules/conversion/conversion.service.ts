import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { ConversionTask, TaskStatus, ConversionType, OUTPUT_EXTENSIONS } from '../task/task.entity';
import { StirlingPdfService } from '../stirling-pdf/stirling-pdf.service';

const ALLOWED_TYPES: Record<string, string[]> = {
  [ConversionType.PDF_TO_WORD]: ['application/pdf'],
  [ConversionType.WORD_TO_PDF]: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  [ConversionType.PDF_TO_JPG]: ['application/pdf'],
  [ConversionType.JPG_TO_PDF]: ['image/jpeg', 'image/png', 'image/jpg'],
};

@Injectable()
export class ConversionService {
  private uploadDir: string;
  private maxFileSize: number;

  constructor(
    private configService: ConfigService,
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
    private stirlingPdfService: StirlingPdfService,
  ) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    this.maxFileSize = parseInt(this.configService.get('MAX_FILE_SIZE') || '20971520', 10);
    
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async createConversion(
    file: Express.Multer.File,
    type: ConversionType,
    ipAddress: string,
  ) {
    if (!file) {
      throw new BadRequestException('请上传文件');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`文件大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`);
    }

    const allowedMimeTypes = ALLOWED_TYPES[type];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('文件类型不支持');
    }
    console.log(file, 'file');
    const taskId = uuidv4();
    const normalizedOriginalName = this.normalizeOriginalName(file.originalname);
    const expireMinutes = parseInt(this.configService.get('FILE_EXPIRE_MINUTES') || '30', 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
    const outputExt = OUTPUT_EXTENSIONS[type].replace('.', '');
    const outputPath = path.join(this.uploadDir, `${taskId}.${outputExt}`);

    let outputBuffer: Buffer;
    const filename = normalizedOriginalName;

    if (type === ConversionType.PDF_TO_WORD) {
      outputBuffer = await this.stirlingPdfService.convertPdfToWordSmart(file.buffer, filename, {
        outputFormat: 'doc',
        enableOcr: true,
        ocr: { languages: this.configService.get('OCR_LANGUAGES') || 'chi_sim+eng' },
      });
    } else if (type === ConversionType.WORD_TO_PDF) {
      outputBuffer = await this.stirlingPdfService.convertFileToPdf(file.buffer, filename);
    } else if (type === ConversionType.PDF_TO_JPG) {
      outputBuffer = await this.stirlingPdfService.convertPdfToImg(file.buffer, filename, {
        imageFormat: 'jpeg',
        dpi: 150,
      });
    } else if (type === ConversionType.JPG_TO_PDF) {
      outputBuffer = await this.stirlingPdfService.convertImgToPdf(file.buffer, filename);
    } else {
      throw new BadRequestException('不支持的转换类型');
    }

    fs.writeFileSync(outputPath, outputBuffer);

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
    ];
  }

  private normalizeOriginalName(name: string): string {
    try {
      const decoded = Buffer.from(name, 'latin1').toString('utf8');
      const hasCJKDecoded = /[\u4e00-\u9fff]/.test(decoded);
      const hasCJKOriginal = /[\u4e00-\u9fff]/.test(name);
      const hasReplacementChar = /�/.test(name);
      const hasMojibakeHints = /Ã|Â|æ|ä|å|Ê|È|¼|½/.test(name);
      
      if ((hasCJKDecoded && !hasCJKOriginal) || hasReplacementChar || hasMojibakeHints) {
        return decoded;
      }
      return name;
    } catch {
      return name;
    }
  }
}
