import { request } from '@/utils/request';
import { PictureBedController } from 'backend-services/picture-bed/picture-bed.controller.ts';

// 上传文件
export const pictureBedUpload = async (file: File) => {
  const {
    data: { data },
  } = await request.postForm<
    GlobalApiTypes<ReturnType<PictureBedController['uploadFile']>>
  >('/picture-bed/upload', { file });

  return data;
};
