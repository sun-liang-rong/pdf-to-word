import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { ConversionService } from './conversion.service';
import { ConversionType, TaskStatus } from '../task/task.entity';

describe('ConversionService PDF operations', () => {
  const repository = { create: jest.fn((value) => value), save: jest.fn(async (value) => value) };
  const stirling = {
    rotatePdf: jest.fn(), extractPages: jest.fn(), addTextWatermark: jest.fn(),
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
  });

  afterEach(() => jest.restoreAllMocks());

  it.each([
    ['createRotatePdfConversion', { angle: 90 }, ConversionType.ROTATE_PDF, 'rotatePdf'],
    ['createExtractPagesConversion', { pageNumbers: '1,3-5' }, ConversionType.EXTRACT_PAGES, 'extractPages'],
    ['createTextWatermarkConversion', { text: 'mark', fontSize: 30, rotation: 0, opacity: 0.5, spacing: 50, customColor: '#abcdef' }, ConversionType.PDF_TEXT_WATERMARK, 'addTextWatermark'],
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

  it.each(['createRotatePdfConversion', 'createExtractPagesConversion', 'createTextWatermarkConversion'])('rejects missing file in %s', async (method) => {
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
