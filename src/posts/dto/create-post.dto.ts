import { IsNotEmpty, Validate, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsURLReachable } from '../../validators/isUrlReachable.validator';
import { IsNotEmptyMultiple } from '../../validators/isNotEmptyMultiple.validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsNotEmptyMultiple(['tagsOld', 'tagsNew'])
  title: string;

  @IsNotEmpty()
  @Validate(IsURLReachable)
  url: string;

  @Transform((value: string | string[]) => {
    const tags = typeof value === 'string' ? [value] : value;
    return tags.map(tag =>
      tag
        .trim()
        .replace(/\W+/g, '-')
        .toLowerCase()
    );
  })
  @IsString({ each: true })
  tagsNew: string[];

  @Transform((value: string | string[]) => {
    console.log('tagsOld', value);
    return typeof value === 'string' ? [value] : value;
  })
  @IsString({ each: true })
  tagsOld: string[];
}
