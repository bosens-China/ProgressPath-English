import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async set(key: string, value: string, expire?: number) {
    if (expire) {
      await this.client.set(key, value, 'EX', expire);
    } else {
      await this.client.set(key, value);
    }
  }

  get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
