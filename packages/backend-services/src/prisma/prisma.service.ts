// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // 可选：在模块初始化时连接数据库
    await this.$connect();
    console.log('Prisma connected to the database.');
  }

  async onModuleDestroy() {
    // 可选：在应用关闭时断开数据库连接
    await this.$disconnect();
    console.log('Prisma disconnected from the database.');
  }

  // 你可以在这里添加一些自定义的数据库清理逻辑（例如，用于测试环境）
  // async cleanDatabase() { ... }
}
