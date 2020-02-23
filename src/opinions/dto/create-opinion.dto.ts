import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOpinionDto {
  @IsNotEmpty()
  @Transform(value => value.trim())
  text: string;
}
