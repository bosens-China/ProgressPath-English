import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FindCoursesQueryDto, parseNumber } from './dto/find-courses-query.dto';
import { ToggleCourseStatusDto } from './dto/toggle-course-status.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.prisma.course.create({
      data: createCourseDto,
    });
  }

  async findAllPaginated(query: FindCoursesQueryDto) {
    const { current, pageSize, title, isPublished } = query;
    const page = parseNumber(current, 1);
    const limit = parseNumber(pageSize, 10);
    const skip = (page - 1) * limit;
    const published =
      isPublished === 'all' || !isPublished
        ? undefined
        : isPublished === 'true';

    const where: Prisma.CourseWhereInput = {};
    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }
    if (published !== undefined) {
      where.isPublished = published;
    }

    const [courses, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc', // Default sort order
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      list: courses,
      total,
      current: page,
      pageSize: limit,
    };
  }

  async findAll() {
    return this.prisma.course.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * @description 获取所有课程的精简信息（ID 和标题）
   * @returns Promise<Array<{ id: number; title: string }>> 包含课程ID和标题的对象数组
   */
  async findAllLite(): Promise<{ id: number; title: string }[]> {
    return this.prisma.course.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    try {
      return await this.prisma.course.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      throw error;
    }
  }

  // Deactivate is essentially updating isPublished to false
  async deactivate(id: number) {
    return this.update(id, { isPublished: false });
  }

  // Optional: Add an activate method if needed
  async activate(id: number) {
    return this.update(id, { isPublished: true });
  }

  async remove(id: number) {
    // Consider if hard delete is really needed, or if deactivation is sufficient
    try {
      return await this.prisma.course.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      throw error;
    }
  }

  async toggleStatus(id: number, toggleCourseStatusDto: ToggleCourseStatusDto) {
    try {
      const course = await this.prisma.course.update({
        where: { id },
        data: { isPublished: toggleCourseStatusDto.isPublished },
      });
      return {
        ...course,
        message: course.isPublished ? '课程已启用' : '课程已停用',
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      throw error;
    }
  }
}
