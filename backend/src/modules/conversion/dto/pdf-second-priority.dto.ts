import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

const pageExpression = /^(all|\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)$/;

export class PdfToExcelDto {
  @IsOptional() @IsString() @Matches(pageExpression) pageNumbers?: string = 'all';
}

export class AddPageNumbersDto {
  @IsOptional() @IsString() @Matches(pageExpression) pageNumbers?: string = 'all';
  @IsOptional() @IsString() @Matches(pageExpression) pagesToNumber?: string = 'all';
  @IsOptional() @IsIn(['small', 'medium', 'large', 'x-large']) customMargin?: 'small' | 'medium' | 'large' | 'x-large' = 'medium';
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) @Max(72) fontSize?: number = 12;
  @IsOptional() @IsIn(['helvetica', 'courier', 'times']) fontType?: 'helvetica' | 'courier' | 'times' = 'helvetica';
  @IsOptional() @Matches(/^#[0-9A-Fa-f]{6}$/) fontColor?: string = '#000000';
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(10) zeroPad?: number = 0;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(9) position?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 = 8;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) startingNumber?: number = 1;
  @IsOptional() @IsString() @Transform(({ value }) => String(value).slice(0, 200)) customText?: string = '{n}';
}

export class ScalePdfDto {
  @IsIn(['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'LETTER', 'LEGAL', 'KEEP'])
  pageSize: 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'LETTER' | 'LEGAL' | 'KEEP';

  @Type(() => Number) @IsNumber() @Min(0.1) @Max(2) scaleFactor: number;
}
