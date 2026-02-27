import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { StirlingPdfService } from '../src/modules/stirling-pdf/stirling-pdf.service';

describe('StirlingPdfService Smart PDF->Word', () => {
  let service: StirlingPdfService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [StirlingPdfService],
    }).compile();
    service = moduleRef.get(StirlingPdfService);
  });

  it('should detect text presence heuristically', () => {
    const textPdfMock = Buffer.from('%PDF-1.7\nBT /F1 12 Tf (Hello) Tj ET\n%%EOF', 'latin1');
    // @ts-ignore access private
    const hasText = (service as any).pdfHasText(textPdfMock);
    expect(hasText).toBe(true);
  });

  it('should proceed without OCR when text present', async () => {
    const textPdfMock = Buffer.from('%PDF-1.7\nBT /F1 12 Tf (Hello) Tj ET\n%%EOF', 'latin1');
    const spyConvert = jest.spyOn(service, 'convertPdfToWord').mockResolvedValue(Buffer.from('PK\x03\x04docx', 'latin1'));
    // @ts-ignore bypass private check via public smart method
    const result = await service.convertPdfToWordSmart(textPdfMock, 'file.pdf', { enableOcr: true });
    expect(spyConvert).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Buffer);
    spyConvert.mockRestore();
  });

  it('integration: converts via API when STIRLING_PDF_URL is set', async () => {
    if (!process.env.STIRLING_PDF_URL) {
      console.warn('Skipping integration test: STIRLING_PDF_URL not set');
      return;
    }
    // This test expects a sample PDF available at runtime; you can adjust buffer source
    const sample = Buffer.from('%PDF-1.7\n% Mock minimal PDF for pipeline\n1 0 obj << /Type /Catalog >> endobj\n%%EOF', 'latin1');
    const buf = await service.convertPdfToWordSmart(sample, 'sample.pdf', {
      outputFormat: 'docx',
      enableOcr: true,
      ocr: { languages: process.env.OCR_LANGUAGES || 'chi_sim+eng' },
    });
    expect(buf.length).toBeGreaterThan(0);
  });
});

