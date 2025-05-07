import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionDto } from './create-section.dto';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

/**
 * @description 更新小节的数据传输对象
 * @description 所有字段均为可选
 */
export class UpdateSectionDto extends PartialType(CreateSectionDto) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  // courseId 通常在更新小节时不修改，如果允许修改，则取消注释
  /*
  @ApiPropertyOptional({ description: '所属课程ID', example: 1 })
  @IsOptional()
  @IsInt({ message: '课程ID必须是整数' })
  @Min(1, { message: '课程ID必须大于0' })
  courseId?: number;
  */

  @IsOptional()
  @IsInt({ message: '排序字段必须是整数' })
  @Min(0, { message: '排序字段不能为负数' })
  order?: number;
}
