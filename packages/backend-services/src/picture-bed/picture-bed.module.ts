import { Module } from '@nestjs/common';
import { PictureBedService } from './picture-bed.service';
import { PictureBedController } from './picture-bed.controller';

@Module({
  controllers: [PictureBedController],
  providers: [PictureBedService],
})
export class PictureBedModule {}
