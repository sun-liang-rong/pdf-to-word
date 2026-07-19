import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

const toBool = ({ value }: { value: unknown }) => value === true || value === 'true';
const toLanguages = ({ value }: { value: unknown }) => Array.isArray(value) ? value : String(value || '').split(',').map((item) => item.trim()).filter(Boolean);

export class OcrPdfDto {
  @Transform(toLanguages)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsIn(['chi_sim', 'chi_tra', 'eng', 'jpn', 'kor', 'deu', 'fra', 'spa'], { each: true })
  languages: string[] = ['chi_sim', 'eng'];

  @Transform(toBool) @IsBoolean() @IsOptional() deskew?: boolean;
  @Transform(toBool) @IsBoolean() @IsOptional() clean?: boolean;
  @IsIn(['skip-text', 'force-ocr', 'Normal']) @IsOptional() ocrType?: 'skip-text' | 'force-ocr' | 'Normal';
  @IsIn(['hocr', 'sandwich']) @IsOptional() ocrRenderType?: 'hocr' | 'sandwich';
}
