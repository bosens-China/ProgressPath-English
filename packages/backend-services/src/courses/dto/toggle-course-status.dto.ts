import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleCourseStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;
}
