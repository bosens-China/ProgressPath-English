import { IsInt, IsNotEmpty, Min } from 'class-validator';

/**
 * @description 单个问题排序项的数据传输对象
 */
export class QuestionOrderItem {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order: number;
}

/**
 * @description 批量更新问题排序的数据传输对象
 */
export class UpdateQuestionOrderDto {
  @IsNotEmpty()
  items: QuestionOrderItem[];
}
