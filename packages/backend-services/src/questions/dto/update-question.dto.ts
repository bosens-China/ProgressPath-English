import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';

/**
 * @description 更新问题的数据传输对象
 * @description 所有字段均为可选
 */
export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
