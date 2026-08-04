import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { ApplicationError } from '../../common/errors/application-error';
import { ConversionTask, TaskStatus } from '../task/task.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
  ) {}

  async getDownloadFile(taskId: string): Promise<{ path: string; fileName: string }> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new ApplicationError('TASK_NOT_FOUND', '任务不存在', {
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    if (task.expiresAt && task.expiresAt.getTime() <= Date.now()) {
      throw new ApplicationError('TASK_EXPIRED', '任务已过期，请重新上传转换', {
        statusCode: HttpStatus.GONE,
      });
    }
    if (task.status !== TaskStatus.COMPLETED || !task.outputPath) {
      throw new ApplicationError('OUTPUT_NOT_READY', '转换结果尚不可下载', {
        statusCode: HttpStatus.CONFLICT,
        retryable: task.status !== TaskStatus.FAILED,
      });
    }

    if (!fs.existsSync(task.outputPath)) {
      throw new ApplicationError('OUTPUT_NOT_FOUND', '转换文件已过期或不存在', {
        statusCode: HttpStatus.GONE,
      });
    }
    
    return {
      path: task.outputPath,
      fileName: task.getOutputFileName(),
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Delete file error:', error);
    }
  }
}
