import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * @description 单个小节排序项的数据传输对象
 */
export class SectionOrderItem {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order: number;
}

/**
 * @description 批量更新小节排序的数据传输对象
 */
export class UpdateSectionOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionOrderItem)
  items: SectionOrderItem[];
}
