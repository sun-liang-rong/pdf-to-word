import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':id')
  async getTaskStatus(@Param('id') id: string) {
    const task = await this.taskService.getTaskById(id);
    
    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    const apiUrl = this.configService.get('API_URL') || '';
    
    const response: any = {
      id: task.id,
      status: task.status,
      progress: this.taskService.getProgress(task.status),
      originalName: task.originalName,
      type: task.type,
      createdAt: task.createdAt,
    };

    if (task.status === 'completed' && task.outputPath) {
      response.downloadUrl = `${apiUrl}/api/download/${task.id}`;
    }

    if (task.status === 'failed') {
      response.error = task.errorMessage || '转换失败';
    }

    return response;
  }
}
