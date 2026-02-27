import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversionController } from './conversion.controller';
import { ConversionService } from './conversion.service';
import { ConversionTask } from '../task/task.entity';
import { RateLimitModule } from '../rate-limit/rate-limit.module';
import { RateLimit } from '../rate-limit/rate-limit.entity';
import { StirlingPdfModule } from '../stirling-pdf/stirling-pdf.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ConversionTask, RateLimit]),
    RateLimitModule,
    StirlingPdfModule,
  ],
  controllers: [ConversionController],
  providers: [ConversionService],
  exports: [ConversionService],
})
export class ConversionModule {}
