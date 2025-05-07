import { request } from '@/utils/request';
import { CreateSectionDto } from 'backend-services/sections/dto/create-section.dto.js';
import { SectionsController } from 'backend-services/sections/sections.controller.ts';
import { Params } from 'ahooks/lib/useAntdTable/types';
import { UpdateSectionDto } from 'backend-services/sections/dto/update-section.dto.js';
import { FindSectionsQueryDto } from 'backend-services/sections/dto/find-sections-query.dto.js';

// 批量添加小节
export const addSections = async (body: CreateSectionDto[]) => {
  const {
    data: { data },
  } = await request.post<
    GlobalApiTypes<ReturnType<SectionsController['createMany']>>
  >('/sections/batch', body);
  return data;
};

// 小节列表
export const getList = async (
  params: Params[0],
  body?: FindSectionsQueryDto,
) => {
  const {
    data: { data },
  } = await request.get<
    GlobalApiTypes<ReturnType<SectionsController['findAllPaginated']>>
  >('/sections', {
    params: {
      ...params,
      ...body,
    },
  });

  return data;
};

// 更新小节
export const updateSection = async (id: number, body: UpdateSectionDto) => {
  const {
    data: { data },
  } = await request.patch<
    GlobalApiTypes<ReturnType<SectionsController['update']>>
  >(`/sections/${id}`, body);
  return data;
};

// 删除小节
export const deleteSection = async (id: number) => {
  const {
    data: { data },
  } = await request.delete<
    GlobalApiTypes<ReturnType<SectionsController['remove']>>
  >(`/sections/${id}`);
  return data;
};
