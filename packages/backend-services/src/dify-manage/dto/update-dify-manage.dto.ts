import { PartialType } from '@nestjs/mapped-types';
import { CreateDifyManageDto } from './create-dify-manage.dto';

/**
 * @description 更新Dify管理的数据传输对象
 */
export class UpdateDifyManageDto extends PartialType(CreateDifyManageDto) {}
