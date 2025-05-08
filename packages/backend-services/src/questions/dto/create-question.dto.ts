import {
  IsString,
  IsOptional,
  IsInt,
  IsNotEmpty,
  Min,
  IsDefined,
} from 'class-validator';
import { Prisma } from '@prisma/client'; // For Prisma.JsonValue

/**
 * @description 创建问题的数据传输对象
 */
export class CreateQuestionDto {
  @IsNotEmpty({ message: '问题文本不能为空' })
  @IsString()
  questionText: string;

  @IsOptional()
  options?: Prisma.JsonValue;

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsDefined({ message: '问题类型ID不能为空' })
  @IsInt({ message: '问题类型ID必须是整数' })
  @Min(1, { message: '问题类型ID必须大于0' })
  questionTypeId: number;

  @IsOptional()
  @IsInt({ message: '排序字段必须是整数' })
  @Min(0, { message: '排序字段不能为负数' })
  order?: number;

  @IsDefined({ message: '小节ID不能为空' })
  @IsInt({ message: '小节ID必须是整数' })
  @Min(1, { message: '小节ID必须大于0' })
  sectionId: number;
}
