import { Injectable } from '@nestjs/common';
import { uploadFormData } from '@boses/picture-bed-sdk';

@Injectable()
export class PictureBedService {
  async uploadFile(file: Express.Multer.File) {
    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });

    formData.append('file', blob, file.originalname);
    const data = await uploadFormData(formData, `r1motxoo`);
    return data;
  }
}
