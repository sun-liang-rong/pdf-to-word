/**
 * 图片压缩服务
 * 使用 sharp 库进行图片压缩和处理
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import {
  CompressImageOptions,
  CompressImageResult,
  BatchCompressResult,
} from './image.interface';
import { ConversionTask, TaskStatus, ConversionType } from '../task/task.entity';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  private readonly uploadDir: string;
  private readonly fileExpiryMinutes: number;

  constructor(
    private configService: ConfigService,
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
  ) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    // 使用 /uploads/image 目录存放压缩后的图片
    this.uploadDir = path.join(this.uploadDir, 'image');
    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    this.fileExpiryMinutes = parseInt(
      this.configService.get('FILE_EXPIRE_MINUTES') || '30',
      10,
    );
    this.logger.log(`图片上传目录: ${this.uploadDir}`);
  }

  /**
   * 压缩单张图片
   * @param fileBuffer - 图片文件缓冲区
   * @param originalName - 原始文件名
   * @param options - 压缩选项
   * @returns 压缩结果
   */
  async compressImage(
    fileBuffer: Buffer,
    originalName: string,
    options: CompressImageOptions = {},
  ): Promise<CompressImageResult> {
    this.logger.log(`开始压缩图片: ${originalName}`);

    const originalSize = fileBuffer.length;
    const quality = options.quality || 80;
    const maxWidth = options.maxWidth;
    const format = options.format || 'jpg';
    const keepAspectRatio = options.keepAspectRatio !== false;

    try {
      // 获取图片元数据
      const metadata = await sharp(fileBuffer).metadata();
      this.logger.log(
        `原始图片: ${metadata.width}x${metadata.height}, 格式: ${metadata.format}`,
      );

      // 构建 sharp 管道
      let pipeline = sharp(fileBuffer);

      // 如果设置了最大宽度，进行 resize
      if (maxWidth && maxWidth > 0) {
        pipeline = pipeline.resize({
          width: maxWidth,
          withoutEnlargement: true, // 不放大图片
          fit: keepAspectRatio ? 'inside' : 'fill',
        });
      }

      // 设置输出格式和质量
      switch (format) {
        case 'png':
          pipeline = pipeline.png({
            quality: quality,
            compressionLevel: 9,
          });
          break;
        case 'webp':
          pipeline = pipeline.webp({
            quality: quality,
          });
          break;
        case 'jpg':
        default:
          pipeline = pipeline.jpeg({
            quality: quality,
            mozjpeg: true,
          });
          break;
      }

      // 执行压缩
      const compressedBuffer = await pipeline.toBuffer();
      const compressedSize = compressedBuffer.length;

      // 获取压缩后的元数据
      const compressedMetadata = await sharp(compressedBuffer).metadata();

      // 计算压缩率
      const compressionRate = (
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(1);

      // 生成输出文件名
      const outputFilename = this.generateFilename(originalName, format);
      const outputPath = path.join(this.uploadDir, outputFilename);

      // 保存压缩后的文件
      fs.writeFileSync(outputPath, compressedBuffer);

      // 计算过期时间
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.fileExpiryMinutes);

      // 创建数据库任务记录
      const task = this.taskRepository.create({
        originalName: originalName,
        inputPath: '', // 图片压缩不需要 inputPath
        outputPath: outputPath,
        type: ConversionType.IMAGE_COMPRESS,
        status: TaskStatus.COMPLETED,
        fileSize: compressedSize,
        expiresAt: expiresAt,
      });
      await this.taskRepository.save(task);

      this.logger.log(
        `图片压缩完成: ${outputFilename}, 原始: ${this.formatBytes(
          originalSize,
        )}, 压缩后: ${this.formatBytes(
          compressedSize,
        )}, 压缩率: ${compressionRate}%, 任务ID: ${task.id}`,
      );

      return {
        originalSize,
        compressedSize,
        compressionRate: `${compressionRate}%`,
        downloadUrl: `/uploads/image/${outputFilename}`,
        outputFormat: format,
        width: compressedMetadata.width || 0,
        height: compressedMetadata.height || 0,
      };
    } catch (error) {
      this.logger.error(`图片压缩失败: ${error.message}`);
      throw new Error(`图片压缩失败: ${error.message}`);
    }
  }

  /**
   * 批量压缩图片
   * @param files - 图片文件数组
   * @param options - 压缩选项
   * @returns 批量压缩结果
   */
  async compressBatch(
    files: Array<{ buffer: Buffer; filename: string }>,
    options: CompressImageOptions = {},
  ): Promise<BatchCompressResult> {
    this.logger.log(`开始批量压缩: ${files.length} 张图片`);

    const results: CompressImageResult[] = [];

    for (const file of files) {
      try {
        const result = await this.compressImage(
          file.buffer,
          file.filename,
          options,
        );
        results.push(result);
      } catch (error) {
        this.logger.error(`压缩失败 ${file.filename}: ${error.message}`);
        // 继续处理其他文件
        results.push({
          originalSize: file.buffer.length,
          compressedSize: 0,
          compressionRate: '0%',
          downloadUrl: '',
          outputFormat: options.format || 'jpg',
          width: 0,
          height: 0,
        });
      }
    }

    this.logger.log(`批量压缩完成: ${results.length} 张图片`);

    return {
      results,
    };
  }

  /**
   * 生成唯一的文件名
   * @param originalName - 原始文件名
   * @param format - 输出格式
   * @returns 生成的文件名
   */
  private generateFilename(originalName: string, format: string): string {
    const timestamp = Date.now();
    const uuid = uuidv4().slice(0, 8);
    const ext = format === 'jpg' ? 'jpg' : format;
    const nameWithoutExt = path.basename(originalName, path.extname(originalName));
    return `${timestamp}-${uuid}-${nameWithoutExt}.${ext}`;
  }

  /**
   * 格式化文件大小
   * @param bytes - 字节数
   * @returns 格式化后的大小字符串
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 验证图片文件
   * @param buffer - 文件缓冲区
   * @returns 是否为有效的图片
   */
  async validateImage(buffer: Buffer): Promise<boolean> {
    try {
      const metadata = await sharp(buffer).metadata();
      return !!metadata.width && !!metadata.height;
    } catch {
      return false;
    }
  }
}
