import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';

export class RotatePdfDto {
  @Transform(({ value }) => Number(value))
  @IsIn([90, 180, 270])
  angle: 90 | 180 | 270;
}
