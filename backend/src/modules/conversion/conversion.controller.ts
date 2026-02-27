import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ConversionService } from './conversion.service';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { RateLimitGuard } from '../rate-limit/rate-limit.guard';

@Controller('convert')
@UseGuards(RateLimitGuard)
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createConversion(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateConversionDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    return this.conversionService.createConversion(file, body.type, ipAddress);
  }

  @Get('tools')
  async getSupportedTools() {
    return this.conversionService.getSupportedTools();
  }
}
