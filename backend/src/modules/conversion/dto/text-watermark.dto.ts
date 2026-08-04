import { Transform } from 'class-transformer';
import { IsHexColor, IsInt, IsNotEmpty, IsNumber, Max, MaxLength, Min } from 'class-validator';

const toNumber = ({ value }: { value: unknown }) => Number(value);

export class TextWatermarkDto {
  @IsNotEmpty()
  @MaxLength(200)
  text: string;

  @Transform(toNumber)
  @IsNumber()
  @Min(1)
  @Max(200)
  fontSize: number;

  @Transform(toNumber)
  @IsNumber()
  @Min(-360)
  @Max(360)
  rotation: number;

  @Transform(toNumber)
  @IsNumber()
  @Min(0)
  @Max(1)
  opacity: number;

  @Transform(toNumber)
  @IsInt()
  @Min(0)
  @Max(1000)
  spacing: number;

  @IsHexColor()
  customColor: string;
}
