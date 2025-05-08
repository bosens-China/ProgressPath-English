import { request } from '@/utils/request';
import { QuestionTypesController } from 'backend-services/question-types/question-types.controller.ts';
import { Params } from 'ahooks/lib/useAntdTable/types';
import { FindQuestionTypesQueryDto } from 'backend-services/question-types/dto/find-question-types-query.dto.js';
import { CreateQuestionTypeDto } from 'backend-services/question-types/dto/create-question-type.dto.js';
import { UpdateQuestionTypeDto } from 'backend-services/question-types/dto/update-question-type.dto.js';

// 问题类型列表
export const getList = async (
  params: Params[0],
  body?: FindQuestionTypesQueryDto,
) => {
  const {
    data: { data },
  } = await request.get<
    GlobalApiTypes<ReturnType<QuestionTypesController['findAllPaginated']>>
  >('/question-types', {
    params: {
      ...params,
      ...body,
    },
  });

  return data;
};

// 新增问题类型
export const addQuestionType = async (body: CreateQuestionTypeDto) => {
  const {
    data: { data },
  } = await request.post<
    GlobalApiTypes<ReturnType<QuestionTypesController['create']>>
  >('/question-types', body);

  return data;
};

// 编辑问题类型
export const editQuestionType = async (
  id: number,
  body: UpdateQuestionTypeDto,
) => {
  const {
    data: { data },
  } = await request.patch<
    GlobalApiTypes<ReturnType<QuestionTypesController['update']>>
  >(`/question-types/${id}`, body);

  return data;
};

// 删除题型
export const deleteQuestionType = async (id: number) => {
  const {
    data: { data },
  } = await request.delete<
    GlobalApiTypes<ReturnType<QuestionTypesController['remove']>>
  >(`/question-types/${id}`);
  return data;
};
