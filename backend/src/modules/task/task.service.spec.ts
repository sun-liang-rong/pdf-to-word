import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApplicationError } from '../../common/errors/application-error';
import { ConversionTask, ConversionType, TaskStatus } from './task.entity';
import { TaskService } from './task.service';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: { ...jest.requireActual('fs').promises, stat: jest.fn() },
}));

import { promises as fs } from 'fs';

const stat = fs.stat as jest.MockedFunction<typeof fs.stat>;

function task(overrides: Partial<ConversionTask> = {}): ConversionTask {
  return Object.assign(new ConversionTask(), {
    id: 'task-1',
    originalName: 'report.pdf',
    inputPath: '',
    outputPath: '/tmp/task-1.doc',
    type: ConversionType.PDF_TO_WORD,
    status: TaskStatus.COMPLETED,
    errorMessage: null,
    fileSize: 123,
    ipAddress: '127.0.0.1',
    createdAt: new Date('2026-07-17T10:00:00.000Z'),
    updatedAt: new Date('2026-07-17T10:01:00.000Z'),
    expiresAt: new Date('2099-07-17T10:30:00.000Z'),
    ...overrides,
  });
}

describe('TaskService task metadata', () => {
  let repository: Pick<Repository<ConversionTask>, 'findOne' | 'update' | 'find' | 'delete'>;
  let service: TaskService;

  beforeEach(() => {
    jest.resetAllMocks();
    repository = {
      findOne: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as any;
    service = new TaskService(repository as Repository<ConversionTask>);
  });

  it('returns complete download metadata from the stored task and output file', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue(task());
    stat.mockResolvedValue({ size: 456 } as any);

    await expect(service.getTaskResult('task-1')).resolves.toEqual({
      id: 'task-1',
      status: 'completed',
      progress: 100,
      originalName: 'report.pdf',
      type: 'pdf-to-word',
      createdAt: new Date('2026-07-17T10:00:00.000Z'),
      updatedAt: new Date('2026-07-17T10:01:00.000Z'),
      expiresAt: new Date('2099-07-17T10:30:00.000Z'),
      outputFileName: 'report.doc',
      inputSize: 123,
      outputSize: 456,
      canDownload: true,
      downloadUrl: '/api/download/task-1',
    });
  });

  it('returns failed metadata without exposing a download', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue(task({
      status: TaskStatus.FAILED,
      outputPath: null,
      errorMessage: 'conversion failed',
    }));

    await expect(service.getTaskResult('task-1')).resolves.toMatchObject({
      status: 'failed',
      progress: 0,
      outputFileName: 'report.doc',
      inputSize: 123,
      outputSize: null,
      canDownload: false,
      error: 'conversion failed',
    });
  });

  it('classifies an expired task with a typed error', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue(task({ expiresAt: new Date(0) }));

    await expect(service.getTaskResult('task-1')).rejects.toMatchObject({
      code: 'TASK_EXPIRED',
      statusCode: HttpStatus.GONE,
    });
  });

  it('classifies a missing task with a typed error', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.getTaskResult('missing')).rejects.toMatchObject({
      code: 'TASK_NOT_FOUND',
      statusCode: HttpStatus.NOT_FOUND,
    });
  });

  it('marks completed tasks with missing output as unavailable', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue(task());
    stat.mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENOENT' }));

    await expect(service.getTaskResult('task-1')).resolves.toMatchObject({
      status: 'completed',
      outputSize: null,
      canDownload: false,
    });
  });
});
