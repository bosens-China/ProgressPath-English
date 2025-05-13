import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export const FIXED_VERIFICATION_CODE = '9999';
const CODE_EXPIRE_TIME = 300; // 5分钟
const SEND_INTERVAL = 60; // 发送间隔，单位秒

@Injectable()
export class SmsService {
  constructor(private readonly redisService: RedisService) {}

  async sendVerificationCode(phone: string): Promise<boolean> {
    // 检查是否在允许的发送间隔内
    const lastSendTime = await this.redisService.get(`sms:time:${phone}`);
    if (lastSendTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsedTime = currentTime - parseInt(lastSendTime, 10);

      if (elapsedTime < SEND_INTERVAL) {
        const remainingTime = SEND_INTERVAL - elapsedTime;
        throw new BadRequestException(
          `请求过于频繁，请在${remainingTime}秒后再试`,
        );
      }
    }

    // 记录当前发送时间
    const currentTime = Math.floor(Date.now() / 1000);
    await this.redisService.set(
      `sms:time:${phone}`,
      currentTime.toString(),
      CODE_EXPIRE_TIME,
    );

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
