import { request } from '@/utils/request';
import { FindCoursesQueryDto } from 'backend-services/courses/dto/find-courses-query.dto.js';
import { CoursesController } from 'backend-services/courses/courses.controller.js';
import { Params } from 'ahooks/lib/useAntdTable/types';
import { CreateCourseDto } from 'backend-services/courses/dto/create-course.dto.js';

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

// 新增课程
export const addCourse = async (body: CreateCourseDto) => {
  const {
    data: { data },
  } = await request.post<
    GlobalApiTypes<ReturnType<CoursesController['create']>>
  >('/courses', body);

  return data;
};

// 编辑课程
export const editCourse = async (id: number, body: CreateCourseDto) => {
  const {
    data: { data },
  } = await request.patch<
    GlobalApiTypes<ReturnType<CoursesController['update']>>
  >(`/courses/${id}`, body);

  return data;
};

// 删除课程
export const deleteCourse = async (id: number) => {
  const {
    data: { data },
  } = await request.delete<
    GlobalApiTypes<ReturnType<CoursesController['remove']>>
  >(`/courses/${id}`);
  return data;
};
