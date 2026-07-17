import { DataSource } from 'typeorm';
import { StirlingPdfService } from '../modules/stirling-pdf/stirling-pdf.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  const dataSource = { query: jest.fn() } as unknown as DataSource;
  const stirlingPdfService = { healthCheck: jest.fn() } as unknown as StirlingPdfService;
  let controller: HealthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new HealthController(dataSource, stirlingPdfService);
  });

  it('reports process liveness', () => {
    expect(controller.live()).toEqual(
      expect.objectContaining({ status: 'ok', service: 'pdf-to-word-backend' }),
    );
  });

  it('reports readiness when database and Stirling-PDF are available', async () => {
    (dataSource.query as jest.Mock).mockResolvedValue([{ result: 1 }]);
    (stirlingPdfService.healthCheck as jest.Mock).mockResolvedValue(true);

    await expect(controller.ready()).resolves.toEqual({
      status: 'ok',
      checks: { database: 'up', stirlingPdf: 'up' },
    });
  });

  it('returns service unavailable with dependency status', async () => {
    (dataSource.query as jest.Mock).mockRejectedValue(new Error('database down'));
    (stirlingPdfService.healthCheck as jest.Mock).mockResolvedValue(true);

    try {
      await controller.ready();
      fail('expected readiness check to fail');
    } catch (error) {
      expect(error.getStatus()).toBe(503);
      expect(error.getResponse()).toEqual({
        status: 'unavailable',
        checks: { database: 'down', stirlingPdf: 'up' },
      });
    }
  });
});
