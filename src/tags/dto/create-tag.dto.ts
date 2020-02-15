import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTagDto {
  @IsNotEmpty()
  @Transform(value =>
    value
      .trim()
      .replace(/\W+/g, '-')
      .toLowerCase()
  )
  title: string;
}
