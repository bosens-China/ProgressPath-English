import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class UpdatePhoneDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^1[3-9]\d{9}$/, {
    message: '手机号必须是有效的中国手机号',
  })
  newPhone: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 6, { message: '验证码长度必须在4-6位之间' })
  code: string;
}
