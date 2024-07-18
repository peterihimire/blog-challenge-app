import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class AddBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  categories: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  publishedDate: Date;
}
