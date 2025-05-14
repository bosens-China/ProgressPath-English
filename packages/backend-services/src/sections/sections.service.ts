import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { FindSectionsQueryDto } from './dto/find-sections-query.dto';
import { Prisma, CourseSection } from '@prisma/client';
import { UpdateSectionOrderDto } from './dto/update-section-order.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * @description 批量创建小节
   * @param createSectionDtos 创建小节DTO数组
   * @returns 返回创建成功的小节数量
   */
  async createMany(createSectionDtos: CreateSectionDto[]) {
    // 为每个小节分配递增的order，从当前最大order+1开始
    const coursesMap = new Map<number, number[]>();

    // 提取所有涉及的课程ID
    const courseIds = [
      ...new Set(createSectionDtos.map((dto) => dto.courseId)),
    ];

    // 获取每个课程当前的最大order值
    await Promise.all(
      courseIds.map(async (courseId) => {
        const maxOrderSection = await this.prisma.courseSection.findFirst({
          where: { courseId },
          orderBy: { order: 'desc' },
          select: { order: true },
        });

        const currentMaxOrder = maxOrderSection?.order || 0;
        coursesMap.set(courseId, [currentMaxOrder, 0]); // [当前最大order, 计数器]
      }),
    );

    // 为每个DTO分配递增的order值
    const dataToCreate = createSectionDtos.map((dto) => {
      const courseId = dto.courseId;
      const [currentMaxOrder, counter] = coursesMap.get(courseId) || [0, 0];

      // 递增计数器并更新Map
      const newCounter = counter + 1;
      coursesMap.set(courseId, [currentMaxOrder, newCounter]);

      // 新order = 当前最大order + 递增计数器
      const newOrder = currentMaxOrder + newCounter;

      return {
        ...dto,
        order: newOrder, // 自动分配的order
      };
    });

    const result = await this.prisma.courseSection.createMany({
      data: dataToCreate,
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

    const orderBy: Prisma.CourseSectionOrderByWithRelationInput[] = [];

    if (sortBy) {
      if (sortBy === 'order') {
        orderBy.push({
          order: sortOrder.toLowerCase() as Prisma.SortOrder,
        });
      } else {
        orderBy.push({ [sortBy]: sortOrder.toLowerCase() });
      }
    } else {
      // 默认按order降序排序 (最新添加的在前面)
      orderBy.push({ order: 'desc' });
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
      orderBy: [{ order: 'desc' }, { id: 'asc' }],
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

  /**
   * @description 批量更新小节排序
   * @param updateSectionOrderDto 包含小节ID和顺序的数组
   * @returns 返回更新成功的小节数量
   */
  async updateOrder(updateSectionOrderDto: UpdateSectionOrderDto) {
    const { items } = updateSectionOrderDto;

    // 使用事务来确保所有更新操作都成功执行或全部回滚
    await this.prisma.$transaction(async (tx) => {
      // 第一步：将所有要更新的小节的order设置为负值（临时值）
      // 以避免唯一约束冲突
      await Promise.all(
        items.map((item) =>
          tx.courseSection.update({
            where: { id: item.id },
            data: { order: -item.order - 1000000 }, // 使用一个足够小的负数作为临时值
          }),
        ),
      );

      // 第二步：设置最终的order值
      await Promise.all(
        items.map((item) =>
          tx.courseSection.update({
            where: { id: item.id },
            data: { order: item.order },
          }),
        ),
      );
    });

    return {
      success: true,
      updatedCount: items.length,
      message: `成功更新了 ${items.length} 个小节的排序`,
    };
  }

  /**
   * @description 获取指定课程的当前最大order值
   * @param courseId 课程ID
   * @returns 返回当前最大order值
   * @private
   */
  private async getMaxOrderForCourse(courseId: number): Promise<number> {
    const maxOrderSection = await this.prisma.courseSection.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    return maxOrderSection?.order || 0;
  }
}
