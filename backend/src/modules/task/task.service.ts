import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { ApplicationError } from '../../common/errors/application-error';
import { ConversionTask, TaskStatus } from './task.entity';

export interface TaskResult {
  id: string;
  status: TaskStatus;
  progress: number;
  originalName: string;
  type: ConversionTask['type'];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
  outputFileName: string;
  inputSize: number | null;
  outputSize: number | null;
  canDownload: boolean;
  downloadUrl?: string;
  error?: string;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
  ) {}

  async getTaskById(id: string): Promise<ConversionTask | null> {
    return this.taskRepository.findOne({ where: { id } });
  }

  async getTaskResult(id: string): Promise<TaskResult> {
    const task = await this.getTaskById(id);
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

    let outputSize: number | null = null;
    if (task.status === TaskStatus.COMPLETED && task.outputPath) {
      try {
        outputSize = (await fs.stat(task.outputPath)).size;
      } catch {
        // Cleanup and filesystem races make a completed database row unavailable.
      }
    }

    const canDownload = outputSize !== null;
    const result: TaskResult = {
      id: task.id,
      status: task.status,
      progress: this.getProgress(task.status),
      originalName: task.originalName,
      type: task.type,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      expiresAt: task.expiresAt ?? null,
      outputFileName: task.getOutputFileName(),
      inputSize: task.fileSize == null ? null : Number(task.fileSize),
      outputSize,
      canDownload,
    };

    if (canDownload) result.downloadUrl = `/api/download/${task.id}`;
    if (task.status === TaskStatus.FAILED) {
      result.error = task.errorMessage || '转换失败';
    }
    return result;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    outputPath?: string,
    errorMessage?: string,
  ): Promise<void> {
    const updateData: Partial<ConversionTask> = { status };
    
    if (outputPath) {
      updateData.outputPath = outputPath;
    }
    
    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    await this.taskRepository.update(id, updateData);
  }

  async getExpiredTasks(): Promise<ConversionTask[]> {
    return this.taskRepository.find({
      where: {
        expiresAt: LessThan(new Date()),
      },
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  getProgress(status: TaskStatus): number {
    switch (status) {
      case TaskStatus.WAITING:
        return 10;
      case TaskStatus.PROCESSING:
        return 50;
      case TaskStatus.COMPLETED:
        return 100;
      case TaskStatus.FAILED:
        return 0;
      default:
        return 0;
    }
  }
}
