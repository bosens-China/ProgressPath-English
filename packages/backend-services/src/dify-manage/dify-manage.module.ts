import { Module } from '@nestjs/common';
import { DifyManageService } from './dify-manage.service';
import { DifyManageController } from './dify-manage.controller';

@Module({
  controllers: [DifyManageController],
  providers: [DifyManageService],
  exports: [DifyManageService],
})
export class DifyManageModule {}
