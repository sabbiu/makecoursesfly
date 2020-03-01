import { IsOptional, IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetOpinionsFilterDto {
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
  @IsIn(['text', 'updatedAt'])
  sortby: string = 'updatedAt';

  @IsOptional()
  @Transform(Number)
  @IsIn([-1, 1]) // -1 for desc and 1 for asc
  order: number = -1;
}
