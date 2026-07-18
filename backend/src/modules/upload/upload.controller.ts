import {
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { UploadService } from './upload.service';

@Controller('download')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get(':id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const fileInfo = await this.uploadService.getDownloadFile(id);
    

    const fileName = fileInfo.fileName;
    const fallbackFileName = fileName.replace(/[^ -~]/g, '_') || 'download';
    const encodedFileName = encodeURIComponent(fileName).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));
    
    res.setHeader('Content-Disposition', `attachment; filename="${fallbackFileName}"; filename*=UTF-8''${encodedFileName}`);
    
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === 'docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (ext === 'doc') {
      contentType = 'application/msword';
    } else if (ext === 'pdf') {
      contentType = 'application/pdf';
    } else if (ext === 'zip') {
      contentType = 'application/zip';
    } else if (ext === 'jpg' || ext === 'jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === 'png') {
      contentType = 'image/png';
    }
    res.setHeader('Content-Type', contentType);
    
    const fileStream = fs.createReadStream(fileInfo.path);
    fileStream.on('error', (error) => {
      // A file can disappear after availability was checked; terminate safely.
      res.destroy(error);
    });
    fileStream.pipe(res);
  }
}
