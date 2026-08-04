/**
 * 图片水印控制器
 * 处理图片文字水印相关的 HTTP 请求
 */
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageWatermarkService, AddTextWatermarkOptions } from './image-watermark.service';

interface WatermarkBody {
  text: string;
  fontSize?: string;
  color?: string;
  opacity?: string;
  position?: string;
  rotation?: string;
  margin?: string;
  tile?: string;
  tileSpacing?: string;
}

/**
 * 图片水印控制器
 * 路由前缀: /image-watermark
 */
@Controller('image-watermark')
export class ImageWatermarkController {
  constructor(private readonly imageWatermarkService: ImageWatermarkService) {}

  /**
   * 添加文字水印接口
   * POST /api/image-watermark/text
   * 
   * @param file - 上传的图片文件
   * @param body - 水印配置参数
   * @param res - 响应对象
   */
  @Post('text')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async addTextWatermark(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: WatermarkBody,
    @Res() res: Response,
  ) {
    // 校验图片文件
    if (!file) {
      throw new BadRequestException('请上传图片文件');
    }

    // 校验文件类型
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('仅支持 JPG、PNG、WEBP 格式的图片');
    }

    // 校验水印文字
    if (!body.text || body.text.trim() === '') {
      throw new BadRequestException('请输入水印内容');
    }

    const text = body.text.trim();
    if (text.length > 100) {
      throw new BadRequestException('水印内容不能超过 100 个字符');
    }

    // 解析并校验参数
    const options: AddTextWatermarkOptions = {
      text: text,
    };

    // 字体大小
    if (body.fontSize) {
      const fontSize = parseInt(body.fontSize, 10);
      if (isNaN(fontSize) || fontSize < 10 || fontSize > 200) {
        throw new BadRequestException('字体大小必须在 10-200 之间');
      }
      options.fontSize = fontSize;
    }

    // 颜色
    if (body.color) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(body.color)) {
        throw new BadRequestException('颜色格式不正确，请使用 #RRGGBB 格式');
      }
      options.color = body.color;
    }

    // 透明度
    if (body.opacity) {
      const opacity = parseFloat(body.opacity);
      if (isNaN(opacity) || opacity < 0.1 || opacity > 1) {
        throw new BadRequestException('透明度必须在 0.1-1.0 之间');
      }
      options.opacity = opacity;
    }

    // 位置
    const validPositions = [
      'top-left', 'top-center', 'top-right',
      'center-left', 'center', 'center-right',
      'bottom-left', 'bottom-center', 'bottom-right',
    ];
    if (body.position) {
      if (!validPositions.includes(body.position)) {
        throw new BadRequestException('无效的水印位置');
      }
      options.position = body.position as AddTextWatermarkOptions['position'];
    }

    // 旋转角度
    if (body.rotation) {
      const rotation = parseInt(body.rotation, 10);
      if (isNaN(rotation) || rotation < -180 || rotation > 180) {
        throw new BadRequestException('旋转角度必须在 -180 到 180 之间');
      }
      options.rotation = rotation;
    }

    // 边距
    if (body.margin) {
      const margin = parseInt(body.margin, 10);
      if (isNaN(margin) || margin < 0 || margin > 200) {
        throw new BadRequestException('边距必须在 0-200 之间');
      }
      options.margin = margin;
    }

    // 平铺模式
    if (body.tile) {
      options.tile = body.tile === 'true';
    }

    // 平铺间距
    if (body.tileSpacing) {
      const tileSpacing = parseInt(body.tileSpacing, 10);
      if (isNaN(tileSpacing) || tileSpacing < 50 || tileSpacing > 500) {
        throw new BadRequestException('平铺间距必须在 50-500 之间');
      }
      options.tileSpacing = tileSpacing;
    }

    try {
      // 调用水印服务
      const result = await this.imageWatermarkService.addTextWatermark(
        file.buffer,
        file.originalname,
        options,
      );

      // 返回成功响应
      return res.status(HttpStatus.OK).json({
          url: result.url,
          width: result.width,
          height: result.height,
          size: this.formatBytes(result.size),
          originalSize: this.formatBytes(result.originalSize),
          downloadUrl: result.downloadUrl,
      });
    } catch (error) {
      this.logger.error(`添加水印失败: ${error.message}`);
      throw new HttpException(
        error.message || '水印添加失败，请重试',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private readonly logger = console;

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
}
