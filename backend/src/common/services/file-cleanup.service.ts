import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as fs from 'fs';
import { ConversionTask } from '../../modules/task/task.entity';

@Injectable()
export class FileCleanupService {
  private readonly logger = new Logger(FileCleanupService.name);

  constructor(
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupExpiredFiles() {
    this.logger.log('Starting cleanup of expired files...');
    
    try {
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

      if (cleanedCount > 0) {
        this.logger.log(`Cleaned up ${cleanedCount} files`);
      }
    } catch (error) {
      this.logger.error('Cleanup error:', error);
    }
  }
}
