/**
 * 转换控制器
 * 处理文件转换相关的HTTP请求
 */
import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ConversionService } from './conversion.service';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { RotatePdfDto } from './dto/rotate-pdf.dto';
import { ExtractPagesDto } from './dto/extract-pages.dto';
import { TextWatermarkDto } from './dto/text-watermark.dto';
import { OcrPdfDto } from './dto/ocr-pdf.dto';
import { ProtectPdfDto, UnlockPdfDto } from './dto/pdf-security.dto';
import { CropPdfDto, SignatureDto } from './dto/pdf-priority-tools.dto';
import { AddPageNumbersDto, PdfToExcelDto, ScalePdfDto } from './dto/pdf-second-priority.dto';
import { RateLimitGuard } from '../rate-limit/rate-limit.guard';
import { MergePdfOptions, CompressPdfOptions, RemovePagesOptions, SplitPagesOptions, RearrangePagesOptions, RearrangeMode } from '../stirling-pdf/stirling-pdf.interface';

/**
 * 转换控制器
 * 路由前缀: /convert
 * 应用IP限流守卫，防止恶意请求
 */
@Controller('convert')
@UseGuards(RateLimitGuard)
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  /**
   * 单文件转换接口
   * POST /api/convert
   * 
   * @param file - 上传的文件（通过multipart/form-data传输）
   * @param body - 请求体，包含转换类型
   * @param req - 请求对象，用于获取客户端IP
   * @returns 转换任务信息（taskId, status, message）
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createConversion(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateConversionDto,
    @Req() req: Request,
  ) {
    // 获取客户端IP地址，用于限流和日志记录
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    return this.conversionService.createConversion(file, body.type, ipAddress);
  }

  /**
   * PDF合并接口
   * POST /api/convert/merge
   * 
   * @param files - 上传的多个PDF文件（最多20个）
   * @param body - 合并选项（sortType, removeCertSign, generateToc, clientFileIds）
   * @param req - 请求对象，用于获取客户端IP
   * @returns 合并任务信息（taskId, status, message）
   */
  @Post('merge')
  @UseInterceptors(FilesInterceptor('files', 20))
  async mergePdfs(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { sortType?: string; removeCertSign?: string; generateToc?: string; clientFileIds?: string },
    @Req() req: Request,
  ) {
    // 获取客户端IP地址
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    
    // 构建合并选项对象
    // 注意：FormData传输的布尔值需要从字符串转换
    const options: MergePdfOptions = {
      sortType: body.sortType as any,
      removeCertSign: body.removeCertSign === 'true',
      generateToc: body.generateToc === 'true',
      clientFileIds: body.clientFileIds ? body.clientFileIds.split(',') : undefined,
    };
    
    return this.conversionService.createMergeConversion(files, options, ipAddress);
  }

  /**
   * PDF压缩接口
   * POST /api/convert/compress
   * 
   * @param file - 上传的PDF文件
   * @param body - 压缩选项（optimizeLevel, expectedOutputSize, linearize等）
   * @param req - 请求对象，用于获取客户端IP
   * @returns 压缩任务信息（taskId, status, message）
   */
  @Post('compress')
  @UseInterceptors(FileInterceptor('file'))
  async compressPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      optimizeLevel: string;
      expectedOutputSize?: string;
      linearize?: string;
      normalize?: string;
      grayscale?: string;
      lineArt?: string;
      lineArtThreshold?: string;
      lineArtEdgeLevel?: string;
    },
    @Req() req: Request,
  ) {
    // 获取客户端IP地址
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    
    // 构建压缩选项对象
    const options: CompressPdfOptions = {
      optimizeLevel: parseInt(body.optimizeLevel, 10),
      expectedOutputSize: body.expectedOutputSize,
      linearize: body.linearize === 'true',
      normalize: body.normalize === 'true',
      grayscale: body.grayscale === 'true',
      lineArt: body.lineArt === 'true',
      lineArtThreshold: body.lineArtThreshold ? parseInt(body.lineArtThreshold, 10) : undefined,
      lineArtEdgeLevel: body.lineArtEdgeLevel ? parseInt(body.lineArtEdgeLevel, 10) : undefined,
    };
    
    return this.conversionService.createCompressConversion(file, options, ipAddress);
  }

  /**
   * PDF 删除页面接口
   * POST /api/convert/remove-pages
   * 
   * @param file - 上传的 PDF 文件
   * @param body - 删除页面选项（pageNumbers）
   * @param req - 请求对象，用于获取客户端 IP
   * @returns 删除任务信息（taskId, status, message）
   */
  @Post('remove-pages')
  @UseInterceptors(FileInterceptor('file'))
  async removePages(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { pageNumbers: string },
    @Req() req: Request,
  ) {
    // 获取客户端 IP 地址
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    
    // 构建删除页面选项对象
    const options: RemovePagesOptions = {
      pageNumbers: body.pageNumbers,
    };
    
    return this.conversionService.createRemovePagesConversion(file, options, ipAddress);
  }

  /**
   * PDF 拆分页面接口
   * POST /api/convert/split-pages
   * 
   * @param file - 上传的 PDF 文件
   * @param body - 拆分页面选项（pageNumbers, mergeAll）
   * @param req - 请求对象，用于获取客户端 IP
   * @returns 拆分任务信息（taskId, status, message）
   */
  @Post('split-pages')
  @UseInterceptors(FileInterceptor('file'))
  async splitPages(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { pageNumbers: string; mergeAll?: string },
    @Req() req: Request,
  ) {
    // 获取客户端 IP 地址
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    
    // 构建拆分页面选项对象
    const options: SplitPagesOptions = {
      pageNumbers: body.pageNumbers,
      mergeAll: body.mergeAll === 'true',
    };
    
    return this.conversionService.createSplitPagesConversion(file, options, ipAddress);
  }

  /**
   * PDF 重新排列页面接口
   * POST /api/convert/rearrange-pages
   * 
   * @param file - 上传的 PDF 文件
   * @param body - 重新排列选项（pageNumbers, customMode）
   * @param req - 请求对象，用于获取客户端 IP
   * @returns 重新排列任务信息（taskId, status, message）
   */
  @Post('rearrange-pages')
  @UseInterceptors(FileInterceptor('file'))
  async rearrangePages(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { pageNumbers: string; customMode: string },
    @Req() req: Request,
  ) {
    // 获取客户端 IP 地址
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    
    // 构建重新排列页面选项对象
    const options: RearrangePagesOptions = {
      pageNumbers: body.pageNumbers,
      customMode: body.customMode as RearrangeMode,
    };
    
    return this.conversionService.createRearrangePagesConversion(file, options, ipAddress);
  }

  @Post('rotate')
  @UseInterceptors(FileInterceptor('file'))
  async rotatePdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: RotatePdfDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    return this.conversionService.createRotatePdfConversion(file, body, ipAddress);
  }

  @Post('extract-pages')
  @UseInterceptors(FileInterceptor('file'))
  async extractPages(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ExtractPagesDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    return this.conversionService.createExtractPagesConversion(file, body, ipAddress);
  }

  @Post('watermark/text')
  @UseInterceptors(FileInterceptor('file'))
  async addTextWatermark(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: TextWatermarkDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    return this.conversionService.createTextWatermarkConversion(file, body, ipAddress);
  }

  @Post('ocr')
  @UseInterceptors(FileInterceptor('file'))
  async ocrPdf(@UploadedFile() file: Express.Multer.File, @Body() body: OcrPdfDto, @Req() req: Request) {
    return this.conversionService.createOcrPdfConversion(file, body, req.ip || req.socket.remoteAddress || '');
  }

  @Post('protect')
  @UseInterceptors(FileInterceptor('file'))
  async protectPdf(@UploadedFile() file: Express.Multer.File, @Body() body: ProtectPdfDto, @Req() req: Request) {
    return this.conversionService.createProtectPdfConversion(file, body, req.ip || req.socket.remoteAddress || '');
  }

  @Post('unlock')
  @UseInterceptors(FileInterceptor('file'))
  async unlockPdf(@UploadedFile() file: Express.Multer.File, @Body() body: UnlockPdfDto, @Req() req: Request) {
    return this.conversionService.createUnlockPdfConversion(file, body, req.ip || req.socket.remoteAddress || '');
  }

  @Post('crop')
  @UseInterceptors(FileInterceptor('file'))
  async cropPdf(@UploadedFile() file: Express.Multer.File, @Body() body: CropPdfDto, @Req() req: Request) {
    return this.conversionService.createCropPdfConversion(file, body, req.ip || req.socket.remoteAddress || '');
  }

  @Post('sign')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }, { name: 'signature', maxCount: 1 }]))
  async signPdf(@UploadedFiles() files: { file?: Express.Multer.File[]; signature?: Express.Multer.File[] }, @Body() body: SignatureDto, @Req() req: Request) {
    return this.conversionService.createSignatureConversion(files?.file?.[0], files?.signature?.[0], body, req.ip || req.socket.remoteAddress || '');
  }

  @Post('pdf-to-excel')
  @UseInterceptors(FileInterceptor('file'))
  async pdfToExcel(@UploadedFile() file: Express.Multer.File, @Body() body: PdfToExcelDto, @Req() req: Request) {
    return this.conversionService.createPdfToExcelConversion(file, body, req.ip || req.socket.remoteAddress || '');
  }

  @Post('pdf-to-pptx')
  @UseInterceptors(FileInterceptor('file'))
  async pdfToPptx(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.conversionService.createPdfToPptxConversion(file, {}, req.ip || req.socket.remoteAddress || '');
  }

  @Post('pdf-to-html')
  @UseInterceptors(FileInterceptor('file'))
  async pdfToHtml(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.conversionService.createPdfToHtmlConversion(file, {}, req.ip || req.socket.remoteAddress || '');
  }

  @Post('add-page-numbers')
  @UseInterceptors(FileInterceptor('file'))
  async addPageNumbers(@UploadedFile() file: Express.Multer.File, @Body() body: AddPageNumbersDto, @Req() req: Request) {
    return this.conversionService.createAddPageNumbersConversion(file, body, req.ip || req.socket.remoteAddress || '');
  }

  @Post('scale-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async scalePdf(@UploadedFile() file: Express.Multer.File, @Body() body: ScalePdfDto, @Req() req: Request) {
    return this.conversionService.createScalePdfConversion(file, body, req.ip || req.socket.remoteAddress || '');
  }

  /**
   * 获取支持的转换工具列表
   * GET /api/convert/tools
   * 
   * @returns 支持的转换工具数组，包含名称、描述、输入输出格式等信息
   */
  @Get('tools')
  async getSupportedTools() {
    return this.conversionService.getSupportedTools();
  }
}
