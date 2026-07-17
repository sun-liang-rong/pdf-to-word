import { PATH_METADATA } from '@nestjs/common/constants';
import { ConversionController } from './conversion.controller';

describe('ConversionController PDF operation routes', () => {
  const service = {
    createRotatePdfConversion: jest.fn(), createExtractPagesConversion: jest.fn(),
    createTextWatermarkConversion: jest.fn(),
  };
  const controller = new ConversionController(service as any);
  const file = { originalname: 'input.pdf' } as Express.Multer.File;
  const req = { ip: '127.0.0.1', socket: {} } as any;

  it.each([
    ['rotatePdf', 'rotate', 'createRotatePdfConversion', { angle: 90 }],
    ['extractPages', 'extract-pages', 'createExtractPagesConversion', { pageNumbers: '1,3-5' }],
    ['addTextWatermark', 'watermark/text', 'createTextWatermarkConversion', { text: 'mark', fontSize: 30, rotation: 0, opacity: 0.5, spacing: 50, customColor: '#abcdef' }],
  ])('exposes %s at POST /convert/%s', async (handler, route, serviceMethod, body) => {
    expect(Reflect.getMetadata(PATH_METADATA, (controller as any)[handler])).toBe(route);
    await (controller as any)[handler](file, body, req);
    expect((service as any)[serviceMethod]).toHaveBeenCalledWith(file, body, '127.0.0.1');
  });
});
