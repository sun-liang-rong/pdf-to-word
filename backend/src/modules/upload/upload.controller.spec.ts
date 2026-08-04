import { HttpStatus } from '@nestjs/common';
import { EventEmitter } from 'events';
import { ApplicationError } from '../../common/errors/application-error';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  createReadStream: jest.fn(),
}));

import * as fs from 'fs';

class TestStream extends EventEmitter {
  pipe = jest.fn();
  destroy = jest.fn();
}

describe('UploadController', () => {
  it('propagates typed unavailable errors from the service', async () => {
    const error = new ApplicationError('OUTPUT_NOT_FOUND', '文件不存在', {
      statusCode: HttpStatus.GONE,
    });
    const uploadService = { getDownloadFile: jest.fn().mockRejectedValue(error) };
    const controller = new UploadController(uploadService as unknown as UploadService);

    await expect(controller.downloadFile('task-1', {} as any)).rejects.toBe(error);
  });

  it('destroys the response when the download stream fails after headers are sent', async () => {
    const stream = new TestStream();
    (fs.createReadStream as jest.Mock).mockReturnValue(stream);
    const uploadService = {
      getDownloadFile: jest.fn().mockResolvedValue({ path: '/tmp/task.doc', fileName: 'task.doc' }),
    };
    const response = {
      headersSent: true,
      setHeader: jest.fn(),
      destroy: jest.fn(),
    };
    const controller = new UploadController(uploadService as unknown as UploadService);

    await controller.downloadFile('task-1', response as any);
    stream.emit('error', new Error('disk read failed'));

    expect(response.destroy).toHaveBeenCalled();
  });
});
