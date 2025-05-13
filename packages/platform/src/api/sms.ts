import { request } from '@/utils/request';
import { SmsController } from 'backend-services/sms/sms.controller.ts';
import { SendVerificationCodeDto } from 'backend-services/sms/dto/send-verification-code.dto.ts';

// 发送短信
export const sendSms = async (body: SendVerificationCodeDto) => {
  const {
    data: { data },
  } = await request.post<
    GlobalApiTypes<ReturnType<SmsController['sendVerificationCode']>>
  >('/sms/send-verification-code', body);
  return data;
};
