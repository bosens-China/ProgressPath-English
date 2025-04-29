import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export const FIXED_VERIFICATION_CODE = '9999';
const CODE_EXPIRE_TIME = 300; // 5分钟

@Injectable()
export class SmsService {
  constructor(private readonly redisService: RedisService) {}

  async sendVerificationCode(phone: string): Promise<boolean> {
    // 开发环境使用固定验证码
    await this.redisService.set(
      `sms:${phone}`,
      FIXED_VERIFICATION_CODE,
      CODE_EXPIRE_TIME,
    );
    return true;
  }

  async verifyCode(phone: string, code: string): Promise<boolean> {
    const storedCode = await this.redisService.get(`sms:${phone}`);
    return storedCode === code;
  }
}
