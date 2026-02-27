import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;
  private queueKey = 'queue:conversion:waiting';
  private processingKey = 'queue:conversion:processing';

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST') || 'localhost',
      port: this.configService.get('REDIS_PORT') || 6379,
    });
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  async addTask(taskId: string): Promise<void> {
    await this.redis.lpush(this.queueKey, taskId);
  }

  async getNextTask(): Promise<string | null> {
    const result = await this.redis.brpop(this.queueKey, 5);
    return result ? result[1] : null;
  }

  async markProcessing(taskId: string): Promise<void> {
    await this.redis.hset(this.processingKey, taskId, Date.now().toString());
  }

  async markCompleted(taskId: string): Promise<void> {
    await this.redis.hdel(this.processingKey, taskId);
  }

  async getQueueLength(): Promise<number> {
    return this.redis.llen(this.queueKey);
  }

  async getProcessingCount(): Promise<number> {
    const items = await this.redis.hgetall(this.processingKey);
    return Object.keys(items).length;
  }
}
