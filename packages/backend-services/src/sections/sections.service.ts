import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { FindSectionsQueryDto } from './dto/find-sections-query.dto';
import { Prisma, CourseSection } from '@prisma/client';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * @description 批量创建小节
   * @param createSectionDtos 创建小节DTO数组
   * @returns 返回创建成功的小节数量
   */
  async createMany(createSectionDtos: CreateSectionDto[]) {
    const result = await this.prisma.courseSection.createMany({
      data: createSectionDtos,
      skipDuplicates: true,
    });
    return result;
  }

  /**
   * @description 根据ID删除小节
   * @param id 小节ID
   * @returns 返回删除的小节记录
   * @throws NotFoundException 如果小节未找到
   */
  async remove(id: number): Promise<CourseSection> {
    try {
      return await this.prisma.courseSection.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`ID 为 ${id} 的小节未找到`);
      }
      throw error;
    }
  }

  /**
   * @description 更新小节信息
   * @param id 小节ID
   * @param updateSectionDto 更新小节的DTO
   * @returns 返回更新后的小节记录
   * @throws NotFoundException 如果小节未找到
   */
  async update(
    id: number,
    updateSectionDto: UpdateSectionDto,
  ): Promise<CourseSection> {
    try {
      // 使用 Object.entries 简化字段处理
      const data = Object.entries(
        updateSectionDto,
      ).reduce<Prisma.CourseSectionUpdateInput>((acc, [key, value]) => {
        if (value !== undefined) {
          // 自动处理 null 值（Prisma 会将 null 转为数据库 NULL）
          acc[key as keyof Prisma.CourseSectionUpdateInput] = value;
        }
        return acc;
      }, {});

      if (Object.keys(data).length === 0) {
        const exists = await this.prisma.courseSection.findUnique({
          where: { id },
        });
        if (!exists) throw new NotFoundException(`ID 为 ${id} 的小节未找到`);
        return exists;
      }

      return await this.prisma.courseSection.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`ID 为 ${id} 的小节未找到`);
      }
      throw error;
    }
  }

  /**
   * @description 分页查询小节列表，支持排序和筛选
   * @param query 查询参数 DTO (current, pageSize, sortBy, sortOrder, courseId, title)
   * @returns 返回包含总数和列表的对象 { total: number, list: CourseSection[] }
   */
  async findAllPaginated(
    query: FindSectionsQueryDto,
  ): Promise<{ total: number; list: CourseSection[] }> {
    const {
      current = 1,
      pageSize = 10,
      sortBy,
      sortOrder = 'asc',
      courseId,
      title,
    } = query;
    const skip = (current - 1) * pageSize;

    const where: Prisma.CourseSectionWhereInput = {};
    if (courseId) where.courseId = courseId;
    if (title) where.title = { contains: title, mode: 'insensitive' };

    const orderBy: any[] = []; // 使用 any 类型来避免复杂的 Prisma 类型问题，实际应为 Prisma.CourseSectionOrderByWithRelationInput[]

    if (sortBy) {
      if (sortBy === 'order') {
        orderBy.push({
          order: { sort: sortOrder.toLowerCase(), nulls: 'last' },
        });
      } else {
        orderBy.push({ [sortBy]: sortOrder.toLowerCase() });
      }
    } else {
      orderBy.push({ order: { sort: 'desc', nulls: 'last' } });
      orderBy.push({ id: 'asc' });
    }

    const [list, total] = await this.prisma.$transaction([
      this.prisma.courseSection.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: orderBy.length > 0 ? orderBy : undefined,
      }),
      this.prisma.courseSection.count({ where }),
    ]);

    return { total, list };
  }

  /**
   * @description 获取所有小节列表 (无分页)
   * @returns 返回所有小节的数组
   */
  async findAll(): Promise<CourseSection[]> {
    return this.prisma.courseSection.findMany({
      orderBy: [
        { order: { sort: 'desc', nulls: 'last' } as any },
        { id: 'asc' },
      ],
    });
  }

  /**
   * @description 根据ID查找单个小节
   * @param id 小节ID
   * @returns 返回小节记录
   * @throws NotFoundException 如果小节未找到
   */
  async findOne(id: number): Promise<CourseSection | null> {
    const section = await this.prisma.courseSection.findUnique({
      where: { id },
    });
    if (!section) {
      throw new NotFoundException(`ID 为 ${id} 的小节未找到`);
    }
    return section;
  }
}
