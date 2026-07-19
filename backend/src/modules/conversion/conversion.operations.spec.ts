import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { ConversionService } from './conversion.service';
import { ConversionType, TaskStatus } from '../task/task.entity';

describe('ConversionService PDF operations', () => {
  const repository = { create: jest.fn((value) => value), save: jest.fn(async (value) => value) };
  const stirling = {
    rotatePdf: jest.fn(), extractPages: jest.fn(), addTextWatermark: jest.fn(),
    ocrPdf: jest.fn(), addPassword: jest.fn(), removePassword: jest.fn(), cropPdf: jest.fn(), addSignature: jest.fn(),
  };
  let service: ConversionService;
  const file = {
    buffer: Buffer.from('%PDF-test'), originalname: 'report.pdf', mimetype: 'application/pdf', size: 9,
  } as Express.Multer.File;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ConversionService(
      { get: jest.fn((key: string) => key === 'UPLOAD_DIR' ? '/tmp/pdf-operations-test' : undefined) } as unknown as ConfigService,
      repository as any,
      stirling as any,
    );
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    stirling.rotatePdf.mockResolvedValue(Buffer.from('rotated'));
    stirling.extractPages.mockResolvedValue(Buffer.from('extracted'));
    stirling.addTextWatermark.mockResolvedValue(Buffer.from('watermarked'));
    stirling.ocrPdf.mockResolvedValue(Buffer.from('ocr'));
    stirling.addPassword.mockResolvedValue(Buffer.from('protected'));
    stirling.removePassword.mockResolvedValue(Buffer.from('unlocked'));
    stirling.cropPdf.mockResolvedValue(Buffer.from('cropped'));
    stirling.addSignature.mockResolvedValue(Buffer.from('signed'));
  });

  afterEach(() => jest.restoreAllMocks());

  it.each([
    ['createRotatePdfConversion', { angle: 90 }, ConversionType.ROTATE_PDF, 'rotatePdf'],
    ['createExtractPagesConversion', { pageNumbers: '1,3-5' }, ConversionType.EXTRACT_PAGES, 'extractPages'],
    ['createTextWatermarkConversion', { text: 'mark', fontSize: 30, rotation: 0, opacity: 0.5, spacing: 50, customColor: '#abcdef' }, ConversionType.PDF_TEXT_WATERMARK, 'addTextWatermark'],
    ['createOcrPdfConversion', { languages: ['chi_sim', 'eng'] }, ConversionType.OCR_PDF, 'ocrPdf'],
    ['createProtectPdfConversion', { password: 'open1234' }, ConversionType.PROTECT_PDF, 'addPassword'],
    ['createUnlockPdfConversion', { password: 'open1234' }, ConversionType.UNLOCK_PDF, 'removePassword'],
    ['createCropPdfConversion', { autoCrop: true }, ConversionType.CROP_PDF, 'cropPdf'],
  ] as const)('creates completed PDF task through %s', async (method, options, type, adapter) => {
    const result = await (service as any)[method](file, options, '127.0.0.1');
    expect(stirling[adapter]).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringMatching(/\.pdf$/), expect.any(Buffer));
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      type, status: TaskStatus.COMPLETED, originalName: 'report.pdf', ipAddress: '127.0.0.1',
      outputPath: expect.stringMatching(/\.pdf$/), expiresAt: expect.any(Date),
    }));
    expect(result).toEqual(expect.objectContaining({ status: TaskStatus.COMPLETED, taskId: expect.any(String) }));
  });

  it('creates a completed signature task', async () => {
    const signature = { buffer: Buffer.from('png'), originalname: 'sign.png', mimetype: 'image/png', size: 3 } as Express.Multer.File;
    await service.createSignatureConversion(file, signature, { x: 10, y: 20 }, 'ip');
    expect(stirling.addSignature).toHaveBeenCalledWith(file.buffer, 'report.pdf', signature.buffer, 'sign.png', { x: 10, y: 20 });
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ type: ConversionType.SIGN_PDF }));
  });

  it.each(['createRotatePdfConversion', 'createExtractPagesConversion', 'createTextWatermarkConversion', 'createOcrPdfConversion', 'createProtectPdfConversion', 'createUnlockPdfConversion', 'createCropPdfConversion'])('rejects missing file in %s', async (method) => {
    await expect((service as any)[method](undefined, {}, 'ip')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('does not write output or save a completed task when Stirling fails', async () => {
    stirling.rotatePdf.mockRejectedValue(new Error('Stirling failed'));
    await expect(service.createRotatePdfConversion(file, { angle: 90 }, 'ip')).rejects.toThrow('Stirling failed');
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects unsupported conversion types instead of throwing a TypeError', async () => {
    const image = {
      buffer: Buffer.from('image'), originalname: 'photo.png', mimetype: 'image/png', size: 5,
    } as Express.Multer.File;

    await expect(
      service.createConversion(image, 'image-compress' as ConversionType, 'ip'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
