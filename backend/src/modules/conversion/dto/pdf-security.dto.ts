import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString, Length } from 'class-validator';

const toBool = ({ value }: { value: unknown }) => value === true || value === 'true';

export class ProtectPdfDto {
  @IsString() @Length(4, 128) password: string;
  @IsString() @Length(4, 128) @IsOptional() ownerPassword?: string;
  @Transform(({ value }) => Number(value)) @IsIn([40, 128, 256]) @IsOptional() keyLength?: 40 | 128 | 256;
  @Transform(toBool) @IsBoolean() @IsOptional() preventPrinting?: boolean;
  @Transform(toBool) @IsBoolean() @IsOptional() preventModify?: boolean;
  @Transform(toBool) @IsBoolean() @IsOptional() preventExtractContent?: boolean;
}

export class UnlockPdfDto {
  @IsString() @Length(1, 128) password: string;
}
