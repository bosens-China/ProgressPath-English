import { IsString, IsOptional, IsInt, IsNotEmpty, Min } from 'class-validator';

/**
 * @description 创建小节的数据传输对象
 */
export class CreateSectionDto {
  @IsNotEmpty({ message: '小节标题不能为空' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsInt({ message: '课程ID必须是整数' })
  @Min(1, { message: '课程ID必须大于0' })
  courseId: number;

  @IsOptional()
  @IsInt({ message: '排序字段必须是整数' })
  @Min(0, { message: '排序字段不能为负数' })
  order?: number;
}
