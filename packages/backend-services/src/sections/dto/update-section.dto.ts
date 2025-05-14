import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionDto } from './create-section.dto';
import { IsString, IsOptional } from 'class-validator';

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
}
