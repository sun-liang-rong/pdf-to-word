import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ConversionTask } from '../../modules/task/task.entity';

@Injectable()
export class FileCleanupService {
  private readonly logger = new Logger(FileCleanupService.name);
  private readonly uploadDir: string;
  private readonly imageDir: string;
  private readonly fileExpiryMinutes: number;

  constructor(
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
    private configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    this.imageDir = path.join(this.uploadDir, 'image');
    this.fileExpiryMinutes = parseInt(
      this.configService.get('FILE_EXPIRE_MINUTES') || '30',
      10,
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupExpiredFiles() {
    this.logger.log('Starting cleanup of expired files...');

    try {
      // 1. 清理数据库中过期的转换任务文件（基于 expiresAt）
      const cleanedFromDb = await this.cleanupExpiredTasks();

      // 2. 清理图片目录中过期的文件（基于文件修改时间）
      const cleanedFromImageDir = await this.cleanupExpiredImageFiles();

      const totalCleaned = cleanedFromDb + cleanedFromImageDir;
      if (totalCleaned > 0) {
        this.logger.log(`Cleaned up ${totalCleaned} expired files/tasks`);
      }
    } catch (error) {
      this.logger.error('Cleanup error:', error);
    }
  }

  /**
   * 清理数据库中过期的转换任务
   */
  private async cleanupExpiredTasks(): Promise<number> {
    const expiredTasks = await this.taskRepository.find({
      where: {
        expiresAt: LessThan(new Date()),
      },
    });

    let cleanedCount = 0;

    for (const task of expiredTasks) {
      try {
        if (task.inputPath && fs.existsSync(task.inputPath)) {
          fs.unlinkSync(task.inputPath);
          cleanedCount++;
        }

        if (task.outputPath && fs.existsSync(task.outputPath)) {
          fs.unlinkSync(task.outputPath);
          cleanedCount++;
        }

        await this.taskRepository.delete(task.id);
      } catch (error) {
        this.logger.error(`Failed to cleanup task ${task.id}:`, error);
      }
    }

    return cleanedCount;
  }

  /**
   * 清理图片压缩目录中过期的文件
   */
  private async cleanupExpiredImageFiles(): Promise<number> {
    let cleanedCount = 0;

    // 检查图片目录是否存在
    if (!fs.existsSync(this.imageDir)) {
      return cleanedCount;
    }

    const now = Date.now();
    const expiryMs = this.fileExpiryMinutes * 60 * 1000; // 转换为毫秒

    try {
      const files = fs.readdirSync(this.imageDir);

      for (const file of files) {
        const filePath = path.join(this.imageDir, file);

        try {
          const stats = fs.statSync(filePath);

          // 检查是否是文件（不是目录）
          if (!stats.isFile()) {
            continue;
          }

          // 检查文件是否过期
          const fileAge = now - stats.mtimeMs;
          if (fileAge > expiryMs) {
            fs.unlinkSync(filePath);
            cleanedCount++;
            this.logger.log(`Deleted expired image file: ${file}`);
          }
        } catch (error) {
          this.logger.error(`Failed to process file ${file}:`, error);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to read image directory:`, error);
    }

    return cleanedCount;
  }

}
