import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConversionModule } from './modules/conversion/conversion.module';
import { TaskModule } from './modules/task/task.module';
import { UploadModule } from './modules/upload/upload.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { StirlingPdfModule } from './modules/stirling-pdf/stirling-pdf.module';
import { ImageModule } from './modules/image/image.module';
import { ImageWatermarkModule } from './modules/image-watermark/image-watermark.module';
import { FileCleanupService } from './common/services/file-cleanup.service';
import { ConversionTask } from './modules/task/task.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
console.log(join(process.cwd(), 'uploads/image'));
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads/image'),
      serveRoot: '/uploads/image',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ConversionTask]),
    ConversionModule,
    TaskModule,
    UploadModule,
    RateLimitModule,
    StirlingPdfModule,
    ImageModule,
    ImageWatermarkModule,
  ],
  providers: [FileCleanupService],
})
export class AppModule {}
