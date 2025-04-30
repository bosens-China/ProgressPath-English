import { request } from '@/utils/request';
import { FindCoursesQueryDto } from 'backend-services/courses/dto/find-courses-query.dto.js';
import { CoursesController } from 'backend-services/courses/courses.controller.js';
import { Params } from 'ahooks/lib/useAntdTable/types';

// 获取列表
export const getList = async (
  params: Params[0],
  body?: FindCoursesQueryDto,
) => {
  const {
    data: { data },
  } = await request.get<
    GlobalApiTypes<ReturnType<CoursesController['findAllPaginated']>>
  >('/courses', {
    params: {
      ...params,
      ...body,
    },
  });

  return data;
};
