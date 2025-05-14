import { request } from '@/utils/request';
import { DifyManageController } from 'backend-services/dify-manage/dify-manage.controller.ts';
import { Params } from 'ahooks/lib/useAntdTable/types';
import { FindDifyManageQueryDto } from 'backend-services/dify-manage/dto/find-dify-manage-query.dto.js';
import { CreateDifyManageDto } from 'backend-services/dify-manage/dto/create-dify-manage.dto.js';
import { UpdateDifyManageDto } from 'backend-services/dify-manage/dto/update-dify-manage.dto.js';

/**
 * 获取Dify管理列表(分页)
 */
export const getDifyManageList = async (
  params: Params[0],
  body?: FindDifyManageQueryDto,
) => {
  const {
    data: { data },
  } = await request.get<
    GlobalApiTypes<ReturnType<DifyManageController['findAllPaginated']>>
  >('dify-manage', {
    params: {
      ...params,
      ...body,
    },
  });

  return data;
};

/**
 * 获取所有Dify管理列表(不分页)
 */
export const getAllDifyManage = async () => {
  const {
    data: { data },
  } =
    await request.get<
      GlobalApiTypes<ReturnType<DifyManageController['findAll']>>
    >('dify-manage/all');
  return data;
};

/**
 * 获取单个Dify管理信息
 */
export const getDifyManage = async (id: number) => {
  const {
    data: { data },
  } = await request.get<
    GlobalApiTypes<ReturnType<DifyManageController['findOne']>>
  >(`dify-manage/${id}`);
  return data;
};

/**
 * 创建Dify管理
 */
export const createDifyManage = async (body: CreateDifyManageDto) => {
  const {
    data: { data },
  } = await request.post<
    GlobalApiTypes<ReturnType<DifyManageController['create']>>
  >('dify-manage', body);
  return data;
};

/**
 * 更新Dify管理
 */
export const updateDifyManage = async (
  id: number,
  body: UpdateDifyManageDto,
) => {
  const {
    data: { data },
  } = await request.patch<
    GlobalApiTypes<ReturnType<DifyManageController['update']>>
  >(`dify-manage/${id}`, body);
  return data;
};

/**
 * 删除Dify管理
 */
export const deleteDifyManage = async (id: number) => {
  await request.delete(`dify-manage/${id}`);
  return `删除成功`;
};

// /**
//  * 测试Dify接口
//  */
// export const testDifyConnection = async (id: number, message: string) => {
//    await request.post<
//    GlobalApiTypes<ReturnType<DifyManageController['proxy']>>
//    >(`dify-manage/proxy/${id}`, {
//     query: message,
//     user: 'admin',
//   });
// };
