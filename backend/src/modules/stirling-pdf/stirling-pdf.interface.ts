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

export interface ConvertImgToPdfOptions {
  fitOption?: FitOption;
  colorType?: PdfColorType;
  autoRotate?: boolean;
  pageSize?: string;
  margin?: number;
  imageQuality?: number;
}
