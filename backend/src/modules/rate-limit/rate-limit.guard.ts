import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { RateLimit } from './rate-limit.entity';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    @InjectRepository(RateLimit)
    private rateLimitRepository: Repository<RateLimit>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const maxRequests = parseInt(this.configService.get('RATE_LIMIT_MAX') || '10', 10);
    const windowMs = parseInt(this.configService.get('RATE_LIMIT_WINDOW_MS') || '86400000', 10);

    const request = context.switchToHttp().getRequest();
    const ipAddress = request.ip || request.socket.remoteAddress || 'unknown';

    const windowStart = new Date(Date.now() - windowMs);

    let rateLimit = await this.rateLimitRepository.findOne({
      where: { ipAddress },
    });

    if (!rateLimit) {
      rateLimit = this.rateLimitRepository.create({
        ipAddress,
        requestCount: 1,
        windowStart: new Date(),
      });
      await this.rateLimitRepository.save(rateLimit);
      return true;
    }

    if (rateLimit.windowStart < windowStart) {
      rateLimit.requestCount = 1;
      rateLimit.windowStart = new Date();
      await this.rateLimitRepository.save(rateLimit);
      return true;
    }

    if (rateLimit.requestCount >= maxRequests) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: '今日转换次数已用完，请明日再来',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    rateLimit.requestCount += 1;
    await this.rateLimitRepository.save(rateLimit);

    return true;
  }
}
