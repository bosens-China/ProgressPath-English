import { Public } from '#s/auth/public.decorator';
import { PictureBedService } from './picture-bed.service';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('picture-bed')
export class PictureBedController {
  constructor(private readonly pictureBedService: PictureBedService) {}

  // 文件上传
  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // 替换为文件参数
    return this.pictureBedService.uploadFile(file);
  }
}
