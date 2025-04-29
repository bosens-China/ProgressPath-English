// src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 使 PrismaService 在全局可用，无需在每个模块导入
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 导出 PrismaService 供其他模块注入
})
export class PrismaModule {}
