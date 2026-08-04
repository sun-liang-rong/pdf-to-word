import { Module } from '@nestjs/common';
import { StirlingPdfService } from './stirling-pdf.service';

@Module({
  providers: [StirlingPdfService],
  exports: [StirlingPdfService],
})
export class StirlingPdfModule {}
