import { Controller, Get, Param } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  @Get(':id')
  async getTaskStatus(@Param('id') id: string) {
    return this.taskService.getTaskResult(id);
  }
}
