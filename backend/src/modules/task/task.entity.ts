/**
 * 转换任务实体类
 * 用于定义数据库表结构和任务状态枚举
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 任务状态枚举
 * - WAITING: 等待处理
 * - PROCESSING: 处理中
 * - COMPLETED: 已完成
 * - FAILED: 处理失败
 */
export enum TaskStatus {
  WAITING = 'waiting',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * 转换类型枚举
 * - PDF_TO_WORD: PDF 转 Word 文档
 * - WORD_TO_PDF: Word 文档转 PDF
 * - PDF_TO_JPG: PDF 转 JPG 图片
 * - JPG_TO_PDF: JPG 图片转 PDF
 * - MERGE_PDF: 多个 PDF 合并
 * - COMPRESS_PDF: PDF 压缩
 * - REMOVE_PAGES: PDF 删除页面
 * - SPLIT_PAGES: PDF 拆分页面
 */
export enum ConversionType {
  PDF_TO_WORD = 'pdf-to-word',
  WORD_TO_PDF = 'word-to-pdf',
  PDF_TO_JPG = 'pdf-to-jpg',
  JPG_TO_PDF = 'jpg-to-pdf',
  MERGE_PDF = 'merge-pdf',
  COMPRESS_PDF = 'compress-pdf',
  REMOVE_PAGES = 'remove-pages',
  SPLIT_PAGES = 'split-pages',
  REARRANGE_PAGES = 'rearrange-pages',
  IMAGE_COMPRESS = 'image-compress',
}

/**
 * 输出文件扩展名映射
 * 根据转换类型确定输出文件的扩展名
 */
export const OUTPUT_EXTENSIONS: Record<ConversionType, string> = {
  [ConversionType.PDF_TO_WORD]: '.doc',
  [ConversionType.WORD_TO_PDF]: '.pdf',
  [ConversionType.PDF_TO_JPG]: '.zip',  // PDF 转图片可能有多页，打包为 zip
  [ConversionType.JPG_TO_PDF]: '.pdf',
  [ConversionType.MERGE_PDF]: '.pdf',
  [ConversionType.COMPRESS_PDF]: '.pdf',
  [ConversionType.REMOVE_PAGES]: '.pdf',
  [ConversionType.SPLIT_PAGES]: '.zip',  // PDF 拆分页面可能生成多个文件，打包为 zip
  [ConversionType.REARRANGE_PAGES]: '.pdf',
  [ConversionType.IMAGE_COMPRESS]: '.jpg',  // 图片压缩输出
};

/**
 * 转换任务实体
 * 存储每次文件转换任务的详细信息
 */
@Entity('conversion_tasks')
export class ConversionTask {
  /** 任务唯一标识符 (UUID) */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 原始文件名 */
  @Column({ name: 'original_name', length: 255, charset: 'utf8mb4' })
  originalName: string;

  /** 输入文件路径（当前未使用，保留扩展） */
  @Column({ name: 'input_path', length: 500 })
  inputPath: string;

  /** 输出文件路径 */
  @Column({ name: 'output_path', length: 500, nullable: true })
  outputPath: string;

  /** 转换类型 */
  @Column({
    type: 'enum',
    enum: ConversionType,
    name: 'type',
  })
  type: ConversionType;

  /** 任务状态 */
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.WAITING,
  })
  status: TaskStatus;

  /** 错误信息（任务失败时记录） */
  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  /** 文件大小（字节） */
  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number;

  /** 用户IP地址（用于限流） */
  @Index()
  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  /** 任务创建时间 */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /** 任务更新时间 */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /** 文件过期时间（默认30分钟后自动删除） */
  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt: Date;

  /**
   * 获取输出文件名
   * 将原始文件名替换扩展名后返回
   */
  getOutputFileName(): string {
    const ext = OUTPUT_EXTENSIONS[this.type];
    const nameWithoutExt = this.originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}${ext}`;
  }
}
