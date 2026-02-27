import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TaskStatus {
  WAITING = 'waiting',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ConversionType {
  PDF_TO_WORD = 'pdf-to-word',
  WORD_TO_PDF = 'word-to-pdf',
  PDF_TO_JPG = 'pdf-to-jpg',
  JPG_TO_PDF = 'jpg-to-pdf',
}

export const OUTPUT_EXTENSIONS: Record<ConversionType, string> = {
  [ConversionType.PDF_TO_WORD]: '.docx',
  [ConversionType.WORD_TO_PDF]: '.pdf',
  [ConversionType.PDF_TO_JPG]: '.zip',
  [ConversionType.JPG_TO_PDF]: '.pdf',
};

@Entity('conversion_tasks')
export class ConversionTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'original_name', length: 255, charset: 'utf8mb4' })
  originalName: string;

  @Column({ name: 'input_path', length: 500 })
  inputPath: string;

  @Column({ name: 'output_path', length: 500, nullable: true })
  outputPath: string;

  @Column({
    type: 'enum',
    enum: ConversionType,
    name: 'type',
  })
  type: ConversionType;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.WAITING,
  })
  status: TaskStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number;

  @Index()
  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt: Date;

  getOutputFileName(): string {
    const ext = OUTPUT_EXTENSIONS[this.type];
    const nameWithoutExt = this.originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}${ext}`;
  }
}
