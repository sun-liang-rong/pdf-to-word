import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StirlingPdfService } from '../modules/stirling-pdf/stirling-pdf.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly stirlingPdfService: StirlingPdfService,
  ) {}

  @Get('live')
  live() {
    return {
      status: 'ok',
      service: 'pdf-to-word-backend',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  async ready() {
    const [database, stirlingPdf] = await Promise.all([
      this.checkDatabase(),
      this.stirlingPdfService.healthCheck(),
    ]);
    const checks = {
      database: database ? 'up' : 'down',
      stirlingPdf: stirlingPdf ? 'up' : 'down',
    };

    if (!database || !stirlingPdf) {
      throw new ServiceUnavailableException({ status: 'unavailable', checks });
    }

    return { status: 'ok', checks };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
