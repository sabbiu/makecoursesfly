import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsIn,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @Transform(Number)
  @IsNumber()
  offset: number = 0;

  @IsOptional()
  @Transform(Number)
  @IsNumber()
  limit: number = 20;

  @IsOptional()
  @IsIn(['title', 'createdAt'])
  sortby: string = 'createdAt';

  @IsOptional()
  @Transform(Number)
  @IsIn([-1, 1]) // -1 for desc and 1 for asc
  order: number = -1;

  @IsOptional()
  @Transform((value: string | string[]) => {
    return typeof value === 'string' ? [value] : value;
  })
  @IsString({ each: true })
  tags: string[];
}
