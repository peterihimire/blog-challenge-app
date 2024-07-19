import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class EditPostDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  excerpt: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsOptional()
  categories: string[];

  @IsString()
  @IsOptional()
  status: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedDate: Date;
}
