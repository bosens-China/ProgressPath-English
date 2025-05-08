import { getAllCourses } from '@/api/courses';
import { sectionAll } from '@/api/sections';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';

export const useStructuralSection = () => {
  const { data: [courses = [], sections = []] = [] } = useRequest(() => {
    return Promise.all([getAllCourses(), sectionAll()]);
  });

  // 构建树形结构
  const tree = useMemo(() => {
    return courses.map((course) => ({
      title: course.title,

      value: course.id,
      children: sections
        .filter((section) => section.courseId === course.id)
        .map((section) => ({
          title: section.title,
          value: [section.id, course.id].join(','),
        })),
    }));
  }, [courses, sections]);

  return {
    tree,
    courses,
    sections,
  };
};
