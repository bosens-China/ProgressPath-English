import { Module } from '@nestjs/common';
import { DifyManageService } from './dify-manage.service';
import { DifyManageController } from './dify-manage.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DifyManageController],
  providers: [DifyManageService],
  exports: [DifyManageService],
})
export class DifyManageModule {}
