/**
 * 图片模块
 * 提供图片压缩功能
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ConversionTask } from '../task/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversionTask])],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
