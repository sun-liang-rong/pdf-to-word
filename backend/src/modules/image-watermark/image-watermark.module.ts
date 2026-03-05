/**
 * 图片水印模块
 * 提供图片文字水印功能
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageWatermarkController } from './image-watermark.controller';
import { ImageWatermarkService } from './image-watermark.service';
import { ConversionTask } from '../task/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversionTask])],
  controllers: [ImageWatermarkController],
  providers: [ImageWatermarkService],
  exports: [ImageWatermarkService],
})
export class ImageWatermarkModule {}
