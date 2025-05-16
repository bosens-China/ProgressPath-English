import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

/**
 * @description 创建Dify管理的数据传输对象
 */
export class CreateDifyManageDto {
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '接口地址不能为空' })
  @IsString()
  apiUrl: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Token不能为空' })
  @IsString({
    message: 'Token必须是字符串类型，直接填入API_KEY，无需加Bearer前缀',
  })
  token: string;

  @IsOptional()
  @IsObject()
  body?: Record<string, any>;

  @IsOptional()
  @IsObject()
  headers?: Record<string, any>;
}
