import { ConfigService } from '@nestjs/config';
import { StirlingPdfService } from './stirling-pdf.service';

describe('StirlingPdfService priority PDF tools', () => {
  let service: StirlingPdfService;
  let request: jest.SpyInstance;
  const pdf = Buffer.from('%PDF-test');

  beforeEach(() => {
    service = new StirlingPdfService({ get: jest.fn() } as unknown as ConfigService);
    request = jest.spyOn(service as any, 'makeMultipartRequest').mockResolvedValue(Buffer.from('result'));
  });

  it('sends OCR options using the Stirling OCR contract', async () => {
    await (service as any).ocrPdf(pdf, 'input.pdf', { languages: ['chi_sim', 'eng'], deskew: true, clean: true, ocrType: 'skip-text', ocrRenderType: 'sandwich' });
    expect(request).toHaveBeenCalledWith('/api/v1/misc/ocr-pdf', expect.objectContaining({
      fileInput: pdf, languages: 'chi_sim,eng', deskew: 'true', clean: 'true', ocrType: 'skip-text', ocrRenderType: 'sandwich',
    }), 'input.pdf');
  });

  it('adds and removes PDF passwords through security endpoints', async () => {
    await (service as any).addPassword(pdf, 'input.pdf', { password: 'open1234', ownerPassword: 'owner1234', keyLength: 256, preventPrinting: true });
    expect(request).toHaveBeenCalledWith('/api/v1/security/add-password', expect.objectContaining({ fileInput: pdf, password: 'open1234', ownerPassword: 'owner1234', keyLength: '256', preventPrinting: 'true' }), 'input.pdf');
    await (service as any).removePassword(pdf, 'input.pdf', 'open1234');
    expect(request).toHaveBeenCalledWith('/api/v1/security/remove-password', { fileInput: pdf, password: 'open1234' }, 'input.pdf');
  });

  it('places a signature image using its own multipart filename', async () => {
    const signature = Buffer.from('png');
    await (service as any).addSignature(pdf, 'input.pdf', signature, 'signature.png', { x: 80, y: 120, everyPage: false });
    expect(request).toHaveBeenCalledWith('/api/v1/misc/add-image', { fileInput: pdf, imageFile: signature, x: '80', y: '120', everyPage: 'false' }, 'input.pdf', { imageFile: 'signature.png' });
  });

  it('crops a PDF through the general crop endpoint', async () => {
    await (service as any).cropPdf(pdf, 'input.pdf', { x: 10, y: 20, width: 500, height: 700, autoCrop: false, removeDataOutsideCrop: true });
    expect(request).toHaveBeenCalledWith('/api/v1/general/crop', expect.objectContaining({ fileInput: pdf, x: '10', y: '20', width: '500', height: '700', autoCrop: 'false', removeDataOutsideCrop: 'true' }), 'input.pdf');
  });

  it('converts PDF pages to Excel, PowerPoint and HTML', async () => {
    await (service as any).convertPdfToExcel(pdf, 'input.pdf', '1,3-5');
    expect(request).toHaveBeenCalledWith('/api/v1/convert/pdf/xlsx', { fileInput: pdf, pageNumbers: '1,3-5' }, 'input.pdf');
    await (service as any).convertPdfToPresentation(pdf, 'input.pdf', 'pptx');
    expect(request).toHaveBeenCalledWith('/api/v1/convert/pdf/presentation', { fileInput: pdf, outputFormat: 'pptx' }, 'input.pdf');
    await (service as any).convertPdfToHtml(pdf, 'input.pdf');
    expect(request).toHaveBeenCalledWith('/api/v1/convert/pdf/html', { fileInput: pdf }, 'input.pdf');
  });

  it('adds page numbers or header/footer text using the complete Stirling contract', async () => {
    await (service as any).addPageNumbers(pdf, 'input.pdf', {
      pageNumbers: 'all', pagesToNumber: '2-8', position: 8, startingNumber: 1,
      fontSize: 12, fontType: 'helvetica', fontColor: '#112233', customMargin: 'medium',
      zeroPad: 2, customText: 'Page {n} / {total}',
    });
    expect(request).toHaveBeenCalledWith('/api/v1/misc/add-page-numbers', expect.objectContaining({
      fileInput: pdf, pageNumbers: 'all', pagesToNumber: '2-8', position: '8', startingNumber: '1',
      fontSize: '12', fontType: 'helvetica', fontColor: '#112233', customMargin: 'medium',
      zeroPad: '2', customText: 'Page {n} / {total}',
    }), 'input.pdf');
  });

  it('scales PDF content to a selected page size', async () => {
    await (service as any).scalePages(pdf, 'input.pdf', { pageSize: 'A4', scaleFactor: 0.9 });
    expect(request).toHaveBeenCalledWith('/api/v1/general/scale-pages', { fileInput: pdf, pageSize: 'A4', scaleFactor: '0.9' }, 'input.pdf');
  });
});
