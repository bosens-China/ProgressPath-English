import { IsString, IsInt, IsNotEmpty, Min, IsObject } from 'class-validator';

/**
 * @description 创建小节的数据传输对象
 */
export class CreateSectionDto {
  @IsNotEmpty({ message: '小节标题不能为空' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: '小节内容不能为空' })
  @IsString()
  content: string;

  @IsNotEmpty({ message: '小节结构不能为空' })
  @IsObject()
  structure: Record<string, any>;

  @IsInt({ message: '课程ID必须是整数' })
  @Min(1, { message: '课程ID必须大于0' })
  courseId: number;
}
