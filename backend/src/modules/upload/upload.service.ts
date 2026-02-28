import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { ConversionTask, TaskStatus } from '../task/task.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(ConversionTask)
    private taskRepository: Repository<ConversionTask>,
  ) {}

  async getDownloadFile(taskId: string): Promise<{ path: string; fileName: string } | null> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    
    if (!task || task.status !== TaskStatus.COMPLETED || !task.outputPath) {
      return null;
    }

    if (!fs.existsSync(task.outputPath)) {
      return null;
    }

    const outputFileName = this.getOutputFileName(task.originalName, task.type);
    
    return {
      path: task.outputPath,
      fileName: outputFileName,
    };
  }

  private getOutputFileName(originalName: string, type: string): string {
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    
    switch (type) {
      case 'pdf-to-word':
        return `${baseName}.doc`;
      case 'word-to-pdf':
        return `${baseName}.pdf`;
      case 'pdf-to-jpg':
        return `${baseName}.zip`;
      case 'jpg-to-pdf':
        return `${baseName}.pdf`;
      case 'split-pages':
        return `${baseName}_split.zip`;
      case 'rearrange-pages':
        return `${baseName}_rearranged.pdf`;
      default:
        return `${baseName}.pdf`;
    }
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
