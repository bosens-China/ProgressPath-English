import { request } from '@/utils/request';
import { FindCoursesQueryDto } from 'backend-services/courses/dto/find-courses-query.dto.js';
import { CoursesController } from 'backend-services/courses/courses.controller.js';
import { Params } from 'ahooks/lib/useAntdTable/types';
import { CreateCourseDto } from 'backend-services/courses/dto/create-course.dto.js';
import { ToggleCourseStatusDto } from 'backend-services/courses/dto/toggle-course-status.dto.js';

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
  await request.delete<GlobalApiTypes<ReturnType<CoursesController['remove']>>>(
    `/courses/${id}`,
  );
  return `删除课程成功`;
};

// 全部课程，只包含id和title
export const getAllCourses = async () => {
  const {
    data: { data },
  } =
    await request.get<
      GlobalApiTypes<ReturnType<CoursesController['findAllLite']>>
    >('/courses/all-lite');
  return data;
};

// 启用停用课程
export const toggleCourseStatus = async (
  id: number,
  body: ToggleCourseStatusDto,
) => {
  const {
    data: { data },
  } = await request.patch<
    GlobalApiTypes<ReturnType<CoursesController['toggleStatus']>>
  >(`/courses/${id}/toggle-status`, body);
  return data;
};
