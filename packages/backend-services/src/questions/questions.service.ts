import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FindQuestionsQueryDto } from './dto/find-questions-query.dto';
import { Prisma, SectionQuestion } from '@prisma/client';
import * as _ from 'lodash';
import { UpdateQuestionOrderDto } from './dto/update-question-order.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * @description 批量创建问题
   * @param createQuestionDtos 创建问题DTO数组
   * @returns Prisma BatchPayload (包含创建数量)
   */
  async createMany(createQuestionDtos: CreateQuestionDto[]) {
    const dataToCreate = createQuestionDtos.map((dto) => {
      const { questionTypeId, options, sectionId, ...rest } = dto;
      const mappedOptions = _.cond([
        [_.isUndefined.bind(null), () => undefined],
        [_.isNull.bind(null), () => Prisma.JsonNull],
        [_.stubTrue.bind(null), (opts) => opts],
      ])(options);
      return {
        ...rest,
        sectionId,
        questionTypeId,
        order: null,
        ...(mappedOptions !== undefined && { options: mappedOptions }),
      };
    });
    return this.prisma.sectionQuestion.createMany({
      data: dataToCreate as Prisma.SectionQuestionCreateManyInput[],
      skipDuplicates: true,
    });
  }

  /**
   * @description 分页查询问题列表
   * @param query 查询参数 (分页、筛选、排序)
   * @returns Promise<{ total: number; list: (SectionQuestion & { questionType: { name: string } | null })[] }>
   */
  async findAllPaginated(query: FindQuestionsQueryDto): Promise<{
    total: number;
    list: (SectionQuestion & { questionType: { name: string } | null })[];
  }> {
    const {
      current = 1,
      pageSize = 10,
      title,
      sectionId,
      courseId,
      questionTypeId,
      sortBy,
      sortOrder = 'asc',
    } = query;
    const skip = (current - 1) * pageSize;
    const where: Prisma.SectionQuestionWhereInput = {};

    if (title) {
      where.questionText = { contains: title, mode: 'insensitive' };
    }

    if (questionTypeId) {
      where.questionTypeId = questionTypeId;
    }

    if (sectionId) {
      where.sectionId = sectionId;
    } else if (courseId) {
      // 如果提供了 courseId 但未提供 sectionId，则查找该课程下的所有小节的问题
      const sectionsInCourse = await this.prisma.courseSection.findMany({
        where: { courseId },
        select: { id: true },
      });
      const sectionIdsInCourse = sectionsInCourse.map((s) => s.id);
      if (sectionIdsInCourse.length === 0) {
        // 如果课程没有小节，或者课程不存在，则返回空列表
        return { total: 0, list: [] };
      }
      where.sectionId = { in: sectionIdsInCourse };
    }

    const orderBy: any[] = []; // Use any[] as per sections.service.ts reference style for orderBy array
    if (sortBy) {
      if (sortBy === 'order') {
        orderBy.push({
          order: { sort: sortOrder.toLowerCase(), nulls: 'last' } as any,
        });
      } else {
        orderBy.push({ [sortBy]: sortOrder.toLowerCase() });
      }
    } else {
      orderBy.push({ order: { sort: 'asc', nulls: 'last' } as any });
      orderBy.push({ updatedAt: 'desc' });
    }

    const [list, total] = await this.prisma.$transaction([
      this.prisma.sectionQuestion.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: orderBy.length > 0 ? orderBy : undefined,
        include: {
          questionType: true,
        },
      }),
      this.prisma.sectionQuestion.count({ where }),
    ]);

    const typedList = list as (SectionQuestion & {
      questionType: { name: string } | null;
    })[];
    return { total, list: typedList };
  }

  /**
   * @description 获取所有问题列表 (可选按 sectionId 筛选)
   * @param sectionId 可选，按小节ID筛选
   * @returns Promise<(SectionQuestion & { questionType: { name: string } | null })[]>
   */
  async findAll(
    sectionId?: number,
  ): Promise<(SectionQuestion & { questionType: { name: string } | null })[]> {
    const questions = await this.prisma.sectionQuestion.findMany({
      where: sectionId ? { sectionId } : {},
      orderBy: [
        { order: { sort: 'asc', nulls: 'last' } as any },
        { updatedAt: 'desc' },
      ],
      include: {
        questionType: true,
      },
    });
    return questions as (SectionQuestion & {
      questionType: { name: string } | null;
    })[];
  }

  /**
   * @description 根据ID查找单个问题
   * @param id 问题ID
   * @returns Promise<SectionQuestion & { questionType: { name: string } | null }>
   * @throws NotFoundException 如果问题未找到
   */
  async findOne(
    id: number,
  ): Promise<SectionQuestion & { questionType: { name: string } | null }> {
    const question = await this.prisma.sectionQuestion.findUnique({
      where: { id },
      include: {
        questionType: true,
      },
    });
    if (!question) {
      throw new NotFoundException(`ID 为 ${id} 的问题未找到`);
    }
    return question as SectionQuestion & {
      questionType: { name: string } | null;
    };
  }

  /**
   * @description 更新问题信息
   * @param id 问题ID
   * @param updateQuestionDto 更新问题DTO
   * @returns Promise<SectionQuestion>
   * @throws NotFoundException 如果问题未找到
   */
  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<SectionQuestion> {
    const { questionTypeId, options, ...restDto } = updateQuestionDto;

    const mappedOptions = _.cond([
      [_.isNull.bind(null), () => Prisma.JsonNull],
      [_.isUndefined.bind(null), () => null],
      [_.stubTrue.bind(null), (opts) => opts],
    ])(options);

    const dataToUpdate = _.omitBy(
      {
        ...restDto,
        ...(questionTypeId !== undefined && { questionTypeId }),
        ...(mappedOptions !== undefined && { options: mappedOptions }),
      },
      _.isUndefined.bind(null),
    );

    if (_.isEmpty(dataToUpdate)) {
      return this.findOne(id);
    }

    try {
      return await this.prisma.sectionQuestion.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`ID 为 ${id} 的问题未找到`);
      }
      throw error;
    }
  }

  /**
   * @description 删除问题
   * @param id 问题ID
   * @returns Promise<SectionQuestion>
   * @throws NotFoundException 如果问题未找到
   */
  async remove(id: number): Promise<SectionQuestion> {
    try {
      return await this.prisma.sectionQuestion.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`ID 为 ${id} 的问题未找到`);
      }
      throw error;
    }
  }

  // Define a type for questions that include their type information
  // This can be exported and used by the frontend if needed, e.g. QuestionWithOptions
  public async getQuestionWithDetails(
    id: number,
  ): Promise<
    (SectionQuestion & { questionType: { name: string } | null }) | null
  > {
    return this.prisma.sectionQuestion.findUnique({
      where: { id },
      include: { questionType: true }, // Include the question type details
    });
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<SectionQuestion> {
    const { options, questionTypeId, ...rest } = createQuestionDto;
    const mappedOptions = _.cond([
      [_.isUndefined.bind(null), () => undefined],
      [_.isNull.bind(null), () => Prisma.JsonNull],
      [_.stubTrue.bind(null), (opts) => opts],
    ])(options);

    return this.prisma.sectionQuestion.create({
      data: {
        ...rest,
        questionTypeId, // Use the new questionTypeId
        ...(mappedOptions !== undefined && { options: mappedOptions }),
      },
    });
  }

  /**
   * @description 批量更新问题排序
   * @param updateQuestionOrderDto 包含问题ID和顺序的数组
   * @returns 返回更新成功的问题数量
   */
  async updateOrder(updateQuestionOrderDto: UpdateQuestionOrderDto) {
    const { items } = updateQuestionOrderDto;

    // 使用事务来确保所有更新操作都成功执行或全部回滚
    await this.prisma.$transaction(async (tx) => {
      // 第一步：将所有要更新的问题的order设置为负值（临时值）
      // 以避免唯一约束冲突
      await Promise.all(
        items.map((item) =>
          tx.sectionQuestion.update({
            where: { id: item.id },
            data: { order: -item.order - 1000000 }, // 使用一个足够小的负数作为临时值
          }),
        ),
      );

      // 第二步：设置最终的order值
      await Promise.all(
        items.map((item) =>
          tx.sectionQuestion.update({
            where: { id: item.id },
            data: { order: item.order },
          }),
        ),
      );
    });

    return {
      success: true,
      updatedCount: items.length,
      message: `成功更新了 ${items.length} 个问题的排序`,
    };
  }
}
