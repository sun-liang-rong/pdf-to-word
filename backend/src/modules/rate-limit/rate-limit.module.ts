import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimitGuard } from './rate-limit.guard';
import { RateLimit } from './rate-limit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RateLimit])],
  providers: [RateLimitGuard],
  exports: [RateLimitGuard],
})
export class RateLimitModule {}
