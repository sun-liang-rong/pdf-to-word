// stirling-pdf.interface.ts
export interface StirlingPdfConfig {
  baseUrl: string;
  timeout: number;
}

export interface ConvertPdfToWordOptions {
  outputFormat?: 'doc' | 'docx'; // 必填参数，但接口中设为可选并给默认值
}

export interface OcrPdfOptions {
  languages?: string;
  sidecar?: boolean;
  deskew?: boolean;
  clean?: boolean;
  cleanFinal?: boolean;
  ocrType?: 'auto' | 'force' | 'skip';
  ocrRenderType?: 'hocr' | 'searchable' | 'sandwich';
}

export interface SmartPdfToWordOptions {
  outputFormat?: 'doc' | 'docx';
  enableOcr?: boolean;
  ocr?: OcrPdfOptions;
}

export interface ConvertFileToPdfOptions {
  // 文件转PDF的选项（根据实际需要添加）
}

export type ImageFormat = 'jpeg' | 'png' | 'tiff' | 'gif' | 'bmp' | 'webp';
export type SingleOrMultiple = 'single' | 'multiple';
export type ColorType = 'color' | 'grayscale' | 'blackwhite';

export interface ConvertPdfToImgOptions {
  fileInput?: Buffer;
  fileId?: string;
  pageNumbers?: string;
  imageFormat?: ImageFormat;
  singleOrMultiple?: SingleOrMultiple;
  colorType?: ColorType;
  dpi?: number;
  includeAnnotations?: boolean;
}

export type FitOption = 'contain' | 'cover' | 'fill' | 'none';
export type PdfColorType = 'rgb' | 'cmyk' | 'grayscale' | 'monochrome';
export type MergeSortType = 'order' | 'reverseOrder' | 'byName' | 'byNameReverse' | 'byDate' | 'byDateReverse';

export interface ConvertImgToPdfOptions {
  fitOption?: FitOption;
  colorType?: PdfColorType;
  autoRotate?: boolean;
  pageSize?: string;
  margin?: number;
  imageQuality?: number;
}

export interface MergePdfOptions {
  sortType?: MergeSortType;
  removeCertSign?: boolean;
  generateToc?: boolean;
  clientFileIds?: string[];
}

/**
 * PDF压缩选项
 * 用于配置PDF文件的压缩参数
 */
export interface CompressPdfOptions {
  /** 优化等级（必填），整数值，越高压缩比越大 */
  optimizeLevel: number;
  /** 期望输出大小，如 '100MB'、'500KB' */
  expectedOutputSize?: string;
  /** 是否线性化，开启后PDF适合网页快速浏览 */
  linearize?: boolean;
  /** 是否标准化，提升PDF兼容性 */
  normalize?: boolean;
  /** 是否灰度化，将PDF转为灰度图像 */
  grayscale?: boolean;
  /** 是否高对比度线稿转换 */
  lineArt?: boolean;
  /** 线稿阈值（0-100），控制线稿转换敏感度 */
  lineArtThreshold?: number;
  /** 边缘检测强度（1-3），影响线稿锐利度 */
  lineArtEdgeLevel?: number;
}

/**
 * PDF 删除页面选项
 * 用于配置删除 PDF 指定页面的参数
 */
export interface RemovePagesOptions {
  /** 要删除的页面表达式（必填）
   * 支持格式：
   * - 单页：1,3,5
   * - 范围：2-6
   * - 组合：1,3-5,8
   * - 全部：all
   * - 函数：2n（偶数页）、2n+1（奇数页）、3n、6n-5
   */
  pageNumbers: string;
}

/**
 * PDF 拆分页面选项
 * 用于配置拆分 PDF 为多个独立文件的参数
 */
export interface SplitPagesOptions {
  /** 要拆分的页面表达式（必填）
   * 支持格式：
   * - 单页：1,3,5
   * - 范围：2-6
   * - 组合：1,3-5,8
   * - 全部：all
   * - 函数：2n（偶数页）、2n+1（奇数页）、3n、6n-5
   */
  pageNumbers: string;
  /** 是否合并所有范围为单个 PDF 文件 */
  mergeAll?: boolean;
}

/**
 * PDF 重新排列模式
 */
export type RearrangeMode = 
  | 'CUSTOM'
  | 'REVERSE_ORDER'
  | 'DUPLICATE'
  | 'DUPLEX_SORT'
  | 'BOOKLET_SORT'
  | 'ODD_EVEN_SPLIT'
  | 'ODD_EVEN_MERGE'
  | 'REMOVE_FIRST'
  | 'REMOVE_LAST'
  | 'REMOVE_FIRST_AND_LAST';

/**
 * PDF 重新排列页面选项
 * 用于配置重新排列 PDF 页面顺序的参数
 */
export interface RearrangePagesOptions {
  /** 页面顺序表达式（必填）
   * CUSTOM 模式: 拖拽后的顺序，如 "3,1,2,5,4"
   * REVERSE_ORDER 模式: 可传 "all"
   * DUPLICATE 模式: 倍数，如 "4"
   * 其他模式: 可传 "all"
   */
  pageNumbers: string;
  /** 排列模式 */
  customMode: RearrangeMode;
}
