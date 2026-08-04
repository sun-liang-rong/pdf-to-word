import { IsEnum, IsNotEmpty } from 'class-validator';
import { ConversionType } from '../../task/task.entity';

export class CreateConversionDto {
  @IsNotEmpty()
  @IsEnum(ConversionType)
  type: ConversionType;
}
