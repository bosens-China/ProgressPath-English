import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  // Explicitly include isPublished if needed for updates, PartialType handles optionality
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
