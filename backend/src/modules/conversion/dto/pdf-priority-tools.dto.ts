import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Max, Min, ValidateIf } from 'class-validator';

const toNumber = ({ value }: { value: unknown }) => Number(value);
const toBool = ({ value }: { value: unknown }) => value === true || value === 'true';

export class CropPdfDto {
  @Transform(toBool) @IsBoolean() @IsOptional() autoCrop?: boolean;
  @Transform(toBool) @IsBoolean() @IsOptional() removeDataOutsideCrop?: boolean;
  @ValidateIf((value) => !value.autoCrop) @Transform(toNumber) @IsNumber() @Min(0) x?: number;
  @ValidateIf((value) => !value.autoCrop) @Transform(toNumber) @IsNumber() @Min(0) y?: number;
  @ValidateIf((value) => !value.autoCrop) @Transform(toNumber) @IsNumber() @Min(1) @Max(20000) width?: number;
  @ValidateIf((value) => !value.autoCrop) @Transform(toNumber) @IsNumber() @Min(1) @Max(20000) height?: number;
}

export class SignatureDto {
  @Transform(toNumber) @IsNumber() @Min(0) @Max(20000) x: number;
  @Transform(toNumber) @IsNumber() @Min(0) @Max(20000) y: number;
  @Transform(toBool) @IsBoolean() @IsOptional() everyPage?: boolean;
}
