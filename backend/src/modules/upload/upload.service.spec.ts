import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConversionTask, ConversionType, TaskStatus } from '../task/task.entity';
import { UploadService } from './upload.service';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
}));

import * as fs from 'fs';

function task(overrides: Partial<ConversionTask> = {}): ConversionTask {
  return Object.assign(new ConversionTask(), {
    id: 'task-1',
    originalName: 'report.pdf',
    outputPath: '/tmp/task-1.doc',
    type: ConversionType.PDF_TO_WORD,
    status: TaskStatus.COMPLETED,
    expiresAt: new Date('2099-01-01T00:00:00.000Z'),
    ...overrides,
  });
}

describe('UploadService', () => {
  const findOne = jest.fn();
  const service = new UploadService({ findOne } as unknown as Repository<ConversionTask>);

  beforeEach(() => jest.resetAllMocks());

  it('uses the entity output filename as the download source of truth', async () => {
    findOne.mockResolvedValue(task());
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    await expect(service.getDownloadFile('task-1')).resolves.toEqual({
      path: '/tmp/task-1.doc',
      fileName: 'report.doc',
    });
  });

  it.each([
    [null, 'TASK_NOT_FOUND', HttpStatus.NOT_FOUND],
    [task({ expiresAt: new Date(0) }), 'TASK_EXPIRED', HttpStatus.GONE],
  ])('classifies unavailable tasks', async (storedTask, code, statusCode) => {
    findOne.mockResolvedValue(storedTask);

    await expect(service.getDownloadFile('task-1')).rejects.toMatchObject({ code, statusCode });
  });

  it('classifies a missing output file separately', async () => {
    findOne.mockResolvedValue(task());
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await expect(service.getDownloadFile('task-1')).rejects.toMatchObject({
      code: 'OUTPUT_NOT_FOUND',
      statusCode: HttpStatus.GONE,
    });
  });
});
