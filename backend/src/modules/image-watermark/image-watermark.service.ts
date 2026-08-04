/**
 * 图片水印服务
 * 使用 Sharp 库为图片添加文字水印
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ConversionTask, TaskStatus, ConversionType } from '../task/task.entity';

export interface WatermarkPosition {
  x: number;
  y: number;
}

export interface AddTextWatermarkOptions {
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  rotation?: number;
  margin?: number;
  tile?: boolean;
  tileSpacing?: number;
}

export interface WatermarkResult {
  url: string;
  width: number;
  height: number;
  size: number;
  originalSize: number;
  downloadUrl: string;
}

@Injectable()
export class ImageWatermarkService {
  private readonly logger = new Logger(ImageWatermarkService.name);
  private readonly uploadDir: string;
  private readonly outputDir: string;
  private readonly fileExpiryMinutes: number;

  constructor(
    private configService: ConfigService,
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
  ) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    // 水印图片也放在 /uploads/image 目录
    this.outputDir = path.join(this.uploadDir, 'image');
    this.fileExpiryMinutes = parseInt(
      this.configService.get('FILE_EXPIRE_MINUTES') || '30',
      10,
    );

    // 确保输出目录存在
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 为图片添加文字水印
   * @param imageBuffer - 图片文件缓冲区
   * @param originalName - 原始文件名
   * @param options - 水印选项
   * @returns 水印结果
   */
  async addTextWatermark(
    imageBuffer: Buffer,
    originalName: string,
    options: AddTextWatermarkOptions,
  ): Promise<WatermarkResult> {
    this.logger.log(`开始为图片添加水印: ${originalName}`);

    const startTime = Date.now();
    const originalSize = imageBuffer.length;

    try {
      // 获取图片信息
      const metadata = await sharp(imageBuffer).metadata();
      const imageWidth = metadata.width || 0;
      const imageHeight = metadata.height || 0;

      this.logger.log(`图片尺寸: ${imageWidth}x${imageHeight}`);

      // 验证图片尺寸
      if (imageWidth > 8000 || imageHeight > 8000) {
        throw new Error('图片尺寸过大，最大支持 8000x8000');
      }

      // 设置默认值
      const fontSize = Math.min(
        options.fontSize || 36,
        Math.floor(Math.min(imageWidth, imageHeight) * 0.1),
      );
      const color = options.color || '#FFFFFF';
      const opacity = options.opacity ?? 0.5;
      const position = options.position || 'bottom-right';
      const rotation = options.rotation || 0;
      const margin = options.margin ?? 20;
      const tile = options.tile || false;
      const tileSpacing = options.tileSpacing || 100;

      // 创建水印 SVG
      const watermarkSvg = this.createWatermarkSvg(
        options.text,
        fontSize,
        color,
        opacity,
        rotation,
      );

      // 处理图片
      let pipeline = sharp(imageBuffer);

      if (tile) {
        // 平铺模式
        pipeline = await this.applyTiledWatermark(
          pipeline,
          watermarkSvg,
          imageWidth,
          imageHeight,
          fontSize,
          tileSpacing,
        );
      } else {
        // 单水印模式
        const positionCoords = this.calculatePosition(
          imageWidth,
          imageHeight,
          fontSize,
          position,
          margin,
        );

        pipeline = pipeline.composite([
          {
            input: Buffer.from(watermarkSvg),
            left: positionCoords.x,
            top: positionCoords.y,
          },
        ]);
      }

      // 生成输出文件
      const outputFilename = this.generateFilename(originalName);
      const outputPath = path.join(this.outputDir, outputFilename);

      // 根据原图格式选择输出格式
      const format = metadata.format || 'jpeg';
      let outputBuffer: Buffer;

      switch (format.toLowerCase()) {
        case 'png':
          outputBuffer = await pipeline.png().toBuffer();
          break;
        case 'webp':
          outputBuffer = await pipeline.webp().toBuffer();
          break;
        case 'jpeg':
        case 'jpg':
        default:
          outputBuffer = await pipeline.jpeg({ quality: 90 }).toBuffer();
          break;
      }

      // 保存文件
      fs.writeFileSync(outputPath, outputBuffer);

      // 获取输出图片信息
      const outputMetadata = await sharp(outputBuffer).metadata();

      // 计算过期时间
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.fileExpiryMinutes);

      // 创建数据库任务记录
      const task = this.taskRepository.create({
        originalName: originalName,
        inputPath: '',
        outputPath: outputPath,
        type: ConversionType.IMAGE_COMPRESS, // 复用图片压缩类型
        status: TaskStatus.COMPLETED,
        fileSize: outputBuffer.length,
        expiresAt: expiresAt,
      });
      await this.taskRepository.save(task);

      const duration = Date.now() - startTime;
      this.logger.log(
        `水印添加完成: ${outputFilename}, 耗时: ${duration}ms, 输出大小: ${this.formatBytes(
          outputBuffer.length,
        )}`,
      );

      return {
        url: `/uploads/image/${outputFilename}`,
        width: outputMetadata.width || imageWidth,
        height: outputMetadata.height || imageHeight,
        size: outputBuffer.length,
        originalSize: originalSize,
        downloadUrl: `/uploads/image/${outputFilename}`,
      };
    } catch (error) {
      this.logger.error(`添加水印失败: ${error.message}`);
      throw new Error(`添加水印失败: ${error.message}`);
    }
  }

  /**
   * 创建水印 SVG
   */
  private createWatermarkSvg(
    text: string,
    fontSize: number,
    color: string,
    opacity: number,
    rotation: number,
  ): string {
    // 计算文本尺寸（使用整数）
    const textWidth = Math.round(text.length * fontSize * 0.6);
    const textHeight = Math.round(fontSize * 1.2);

    // 解析颜色
    const rgb = this.hexToRgb(color);
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

    return `
      <svg width="${textWidth}" height="${textHeight}" xmlns="http://www.w3.org/2000/svg">
        <text
          x="50%"
          y="50%"
          font-family="Arial, sans-serif"
          font-size="${fontSize}"
          fill="${rgba}"
          text-anchor="middle"
          dominant-baseline="middle"
          transform="rotate(${rotation}, ${textWidth / 2}, ${textHeight / 2})"
        >${this.escapeXml(text)}</text>
      </svg>
    `;
  }

  /**
   * 计算水印位置
   */
  private calculatePosition(
    imageWidth: number,
    imageHeight: number,
    fontSize: number,
    position: string,
    margin: number,
  ): WatermarkPosition {
    const watermarkWidth = Math.round(fontSize * 4); // 估算水印宽度
    const watermarkHeight = Math.round(fontSize * 1.2);

    let x = margin;
    let y = margin;

    switch (position) {
      case 'top-left':
        x = margin;
        y = margin;
        break;
      case 'top-center':
        x = (imageWidth - watermarkWidth) / 2;
        y = margin;
        break;
      case 'top-right':
        x = imageWidth - watermarkWidth - margin;
        y = margin;
        break;
      case 'center-left':
        x = margin;
        y = (imageHeight - watermarkHeight) / 2;
        break;
      case 'center':
        x = (imageWidth - watermarkWidth) / 2;
        y = (imageHeight - watermarkHeight) / 2;
        break;
      case 'center-right':
        x = imageWidth - watermarkWidth - margin;
        y = (imageHeight - watermarkHeight) / 2;
        break;
      case 'bottom-left':
        x = margin;
        y = imageHeight - watermarkHeight - margin;
        break;
      case 'bottom-center':
        x = (imageWidth - watermarkWidth) / 2;
        y = imageHeight - watermarkHeight - margin;
        break;
      case 'bottom-right':
      default:
        x = imageWidth - watermarkWidth - margin;
        y = imageHeight - watermarkHeight - margin;
        break;
    }

    // 确保不超出边界
    x = Math.max(margin, Math.min(x, imageWidth - watermarkWidth - margin));
    y = Math.max(margin, Math.min(y, imageHeight - watermarkHeight - margin));

    // Sharp 需要整数坐标
    return { x: Math.round(x), y: Math.round(y) };
  }

  /**
   * 应用平铺水印
   */
  private async applyTiledWatermark(
    pipeline: sharp.Sharp,
    watermarkSvg: string,
    imageWidth: number,
    imageHeight: number,
    fontSize: number,
    spacing: number,
  ): Promise<sharp.Sharp> {
    const watermarkWidth = Math.round(fontSize * 4);
    const watermarkHeight = Math.round(fontSize * 1.2);

    const composites: sharp.OverlayOptions[] = [];

    for (let y = 0; y < imageHeight; y += spacing + watermarkHeight) {
      for (let x = 0; x < imageWidth; x += spacing + watermarkWidth) {
        composites.push({
          input: Buffer.from(watermarkSvg),
          left: x,
          top: y,
        });
      }
    }

    return pipeline.composite(composites);
  }

  /**
   * 生成唯一的文件名
   */
  private generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const uuid = uuidv4().slice(0, 8);
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const nameWithoutExt = path.basename(originalName, ext);
    return `${timestamp}-${uuid}-${nameWithoutExt}-watermarked${ext}`;
  }

  /**
   * 格式化文件大小
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 十六进制颜色转 RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  }

  /**
   * 转义 XML 特殊字符
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
