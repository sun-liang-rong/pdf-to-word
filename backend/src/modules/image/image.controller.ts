/**
 * 图片压缩控制器
 * 处理图片压缩相关的 HTTP 请求
 */
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageService } from './image.service';
import {
  CompressImageOptions,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_BATCH_FILES,
} from './image.interface';
import { MulterError } from 'multer';

interface CompressBody {
  quality?: string;
  maxWidth?: string;
  format?: string;
  keepAspectRatio?: string;
}

/**
 * 图片压缩控制器
 * 路由前缀: /api/v1/image
 */
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  /**
   * 单张图片压缩接口
   * POST /api/v1/image/compress
   */
  @Post('compress')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  async compressImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CompressBody,
    @Res() res: Response,
  ) {
    // 校验文件
    if (!file) {
      throw new HttpException('请上传图片文件', HttpStatus.BAD_REQUEST);
    }

    // 校验文件类型
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      throw new HttpException(
        `不支持的图片格式，支持的格式: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 校验文件扩展名
    const ext = file.originalname.toLowerCase().slice(
      file.originalname.lastIndexOf('.'),
    );
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      throw new HttpException(
        `不支持的图片格式，支持的格式: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 禁止 SVG
    if (ext === '.svg' || file.mimetype === 'image/svg+xml') {
      throw new HttpException('不支持 SVG 格式', HttpStatus.BAD_REQUEST);
    }

    // 解析压缩选项
    const options: CompressImageOptions = {
      quality: body.quality ? parseInt(body.quality, 10) : 80,
      maxWidth: body.maxWidth ? parseInt(body.maxWidth, 10) : undefined,
      format: body.format as 'jpg' | 'png' | 'webp',
      keepAspectRatio:
        body.keepAspectRatio === 'false' ? false : true,
    };

    // 校验质量范围
    if (
      options.quality !== undefined &&
      (isNaN(options.quality) || options.quality < 1 || options.quality > 100)
    ) {
      throw new HttpException(
        '压缩质量必须在 1-100 之间',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 校验格式
    if (
      options.format &&
      !['jpg', 'png', 'webp'].includes(options.format)
    ) {
      throw new HttpException(
        '不支持的输出格式，支持: jpg, png, webp',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.imageService.compressImage(
        file.buffer,
        file.originalname,
        options,
      );

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        error.message || '图片压缩失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 批量图片压缩接口
   * POST /api/v1/image/compress/batch
   */
  @Post('compress/batch')
  @UseInterceptors(
    FilesInterceptor('files', MAX_BATCH_FILES, {
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  async compressBatch(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CompressBody,
    @Res() res: Response,
  ) {
    // 校验文件数量
    if (!files || files.length === 0) {
      throw new HttpException('请上传图片文件', HttpStatus.BAD_REQUEST);
    }

    if (files.length > MAX_BATCH_FILES) {
      throw new HttpException(
        `批量上传最多 ${MAX_BATCH_FILES} 个文件`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 校验每个文件
    for (const file of files) {
      if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
        throw new HttpException(
          `不支持的图片格式: ${file.originalname}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const ext = file.originalname.toLowerCase().slice(
        file.originalname.lastIndexOf('.'),
      );
      if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
        throw new HttpException(
          `不支持的图片格式: ${file.originalname}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 禁止 SVG
      if (ext === '.svg' || file.mimetype === 'image/svg+xml') {
        throw new HttpException(
          `不支持 SVG 格式: ${file.originalname}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // 解析压缩选项
    const options: CompressImageOptions = {
      quality: body.quality ? parseInt(body.quality, 10) : 80,
      maxWidth: body.maxWidth ? parseInt(body.maxWidth, 10) : undefined,
      format: body.format as 'jpg' | 'png' | 'webp',
      keepAspectRatio:
        body.keepAspectRatio === 'false' ? false : true,
    };

    // 校验质量范围
    if (
      options.quality !== undefined &&
      (isNaN(options.quality) || options.quality < 1 || options.quality > 100)
    ) {
      throw new HttpException(
        '压缩质量必须在 1-100 之间',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const fileData = files.map((file) => ({
        buffer: file.buffer,
        filename: file.originalname,
      }));

      const result = await this.imageService.compressBatch(fileData, options);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        error.message || '批量压缩失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
