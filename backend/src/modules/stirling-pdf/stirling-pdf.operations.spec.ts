import { ConfigService } from '@nestjs/config';
import { StirlingPdfService } from './stirling-pdf.service';

describe('StirlingPdfService PDF operations', () => {
  let service: StirlingPdfService;
  let request: jest.SpyInstance;
  const pdf = Buffer.from('%PDF-test');

  beforeEach(() => {
    service = new StirlingPdfService({ get: jest.fn() } as unknown as ConfigService);
    request = jest.spyOn(service as any, 'makeMultipartRequest').mockResolvedValue(Buffer.from('result'));
  });

  it('sends global rotation using the rotate endpoint', async () => {
    await service.rotatePdf(pdf, 'input.pdf', 90);
    expect(request).toHaveBeenCalledWith('/api/v1/general/rotate-pdf', { fileInput: pdf, angle: '90' }, 'input.pdf');
  });

  it('extracts pages through rearrange CUSTOM mode', async () => {
    await service.extractPages(pdf, 'input.pdf', '1,3-5');
    expect(request).toHaveBeenCalledWith('/api/v1/general/rearrange-pages', {
      fileInput: pdf, pageNumbers: '1,3-5', customMode: 'CUSTOM',
    }, 'input.pdf');
  });

  it('uses Stirling text watermark form fields', async () => {
    await service.addTextWatermark(pdf, 'input.pdf', {
      text: 'CONFIDENTIAL', fontSize: 30, rotation: -45, opacity: 0.35,
      spacing: 50, customColor: '#abcdef',
    });
    expect(request).toHaveBeenCalledWith('/api/v1/misc/add-watermark', {
      fileInput: pdf, watermarkType: 'text', watermarkText: 'CONFIDENTIAL', alphabet: 'roman',
      fontSize: '30', rotation: '-45', opacity: '0.35', widthSpacer: '50', heightSpacer: '50',
      customColor: '#abcdef', convertPDFToImage: 'false',
    }, 'input.pdf');
  });

  it('extracts rather than removes pages when split mergeAll is enabled', async () => {
    await service.splitPages(pdf, 'input.pdf', { pageNumbers: '1,3', mergeAll: true });
    expect(request).toHaveBeenCalledWith('/api/v1/general/rearrange-pages', {
      fileInput: pdf, pageNumbers: '1,3', customMode: 'CUSTOM',
    }, 'input.pdf');
  });
});
