/**
 * 图片压缩选项接口
 */
export interface CompressImageOptions {
  /** 压缩质量 (0-100) */
  quality?: number;
  /** 最大宽度 (px) */
  maxWidth?: number;
  /** 输出格式: jpg, png, webp */
  format?: 'jpg' | 'png' | 'webp';
  /** 保持宽高比 */
  keepAspectRatio?: boolean;
}

/**
 * 单张图片压缩结果
 */
export interface CompressImageResult {
  /** 原始文件大小 (bytes) */
  originalSize: number;
  /** 压缩后大小 (bytes) */
  compressedSize: number;
  /** 压缩率 */
  compressionRate: string;
  /** 下载路径 */
  downloadUrl: string;
  /** 输出格式 */
  outputFormat: string;
  /** 输出宽度 */
  width: number;
  /** 输出高度 */
  height: number;
}

/**
 * 批量压缩结果
 */
export interface BatchCompressResult {
  /** 压缩结果列表 */
  results: CompressImageResult[];
  /** 打包下载URL (ZIP) */
  zipUrl?: string;
}

/**
 * 支持的图片格式
 */
export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp';

/**
 * 允许的图片MIME类型
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

/**
 * 允许的图片扩展名
 */
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * 最大单文件大小 (20MB)
 */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

/**
 * 批量最大文件数
 */
export const MAX_BATCH_FILES = 10;
