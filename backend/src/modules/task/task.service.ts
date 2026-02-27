import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConversionTask, TaskStatus } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
  ) {}

  async getTaskById(id: string): Promise<ConversionTask | null> {
    return this.taskRepository.findOne({ where: { id } });
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
        expiresAt: MoreThan(new Date()),
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
