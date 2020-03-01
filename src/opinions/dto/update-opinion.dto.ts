import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateOpinionDto {
  @IsNotEmpty()
  @Transform(value => value.trim())
  text?: string;
}
