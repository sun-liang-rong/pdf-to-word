import { Module } from '@nestjs/common';
import { StirlingPdfModule } from '../modules/stirling-pdf/stirling-pdf.module';
import { HealthController } from './health.controller';

@Module({
  imports: [StirlingPdfModule],
  controllers: [HealthController],
})
export class HealthModule {}
