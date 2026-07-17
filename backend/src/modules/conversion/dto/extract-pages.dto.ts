import { IsNotEmpty, ValidateBy } from 'class-validator';
import { isValidPageExpression } from './page-expression';

export class ExtractPagesDto {
  @IsNotEmpty()
  @ValidateBy({
    name: 'isValidPageExpression',
    validator: { validate: isValidPageExpression },
  })
  pageNumbers: string;
}
