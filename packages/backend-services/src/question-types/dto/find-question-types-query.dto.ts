// import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindQuestionTypesQueryDto {
  // @ApiPropertyOptional({ description: '当前页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  current?: number = 1;

  // @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  // @ApiPropertyOptional({ description: '按名称筛选 (模糊匹配)' })
  @IsOptional()
  @IsString()
  name?: string;

  // @ApiPropertyOptional({ description: '排序字段 (例如: name, createdAt)' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  // @ApiPropertyOptional({ description: "排序顺序 ('ASC' 或 'DESC')", enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
