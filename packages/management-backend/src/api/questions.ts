import { request } from '@/utils/request';
import { FindQuestionsQueryDto } from 'backend-services/questions/dto/find-questions-query.dto.js';
import { QuestionsController } from 'backend-services/questions/questions.controller.js';
import { Params } from 'ahooks/lib/useAntdTable/types';
import { CreateQuestionDto } from 'backend-services/questions/dto/create-question.dto.js';

// 获取问题列表
export const getList = async (
  params: Params[0],
  body?: FindQuestionsQueryDto,
) => {
  const {
    data: { data },
  } = await request.get<
    GlobalApiTypes<ReturnType<QuestionsController['findAllPaginated']>>
  >('/questions', {
    params: {
      ...params,
      ...body,
    },
  });

  return data;
};

// 全部问题
export const getAll = async (body?: FindQuestionsQueryDto) => {
  const {
    data: { data },
  } = await request.get<
    GlobalApiTypes<ReturnType<QuestionsController['findAll']>>
  >('/questions/all', {
    params: body,
  });

  return data;
};

// 新增问题
export const addQuestion = async (body: CreateQuestionDto) => {
  const {
    data: { data },
  } = await request.post<
    GlobalApiTypes<ReturnType<QuestionsController['create']>>
  >('/questions', body);

  return data;
};

// 批量添加问题
export const addQuestions = async (body: CreateQuestionDto[]) => {
  const {
    data: { data },
  } = await request.post<
    GlobalApiTypes<ReturnType<QuestionsController['createMany']>>
  >('/questions/batch', body);
  return data;
};

// 编辑问题
export const editQuestion = async (id: number, body: CreateQuestionDto) => {
  const {
    data: { data },
  } = await request.patch<
    GlobalApiTypes<ReturnType<QuestionsController['update']>>
  >(`/questions/${id}`, body);

  return data;
};

// 删除问题
export const deleteQuestion = async (id: number) => {
  await request.delete<
    GlobalApiTypes<ReturnType<QuestionsController['remove']>>
  >(`/questions/${id}`);
  return `删除问题成功`;
};
