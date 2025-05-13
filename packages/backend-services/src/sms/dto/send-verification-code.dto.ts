import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^1[3-9]\d{9}$/, {
    message: '手机号必须是有效的中国手机号',
  })
  phone: string;
}
