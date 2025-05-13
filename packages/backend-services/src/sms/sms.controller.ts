import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { SmsService } from './sms.service';
import { Public } from '../auth/public.decorator';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Public()
  @Post('send-verification-code')
  async sendVerificationCode(
    @Body(ValidationPipe) sendVerificationCodeDto: SendVerificationCodeDto,
  ) {
    await this.smsService.sendVerificationCode(sendVerificationCodeDto.phone);
    return { success: true, message: '验证码已发送' };
  }
}
