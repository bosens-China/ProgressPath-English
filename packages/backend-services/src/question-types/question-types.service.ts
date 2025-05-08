import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionTypeDto } from './dto/create-question-type.dto';
import { UpdateQuestionTypeDto } from './dto/update-question-type.dto';
import { FindQuestionTypesQueryDto } from './dto/find-question-types-query.dto';
import { Prisma, QuestionType } from '@prisma/client';

@Injectable()
export class QuestionTypesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createQuestionTypeDto: CreateQuestionTypeDto,
  ): Promise<QuestionType> {
    try {
      return await this.prisma.questionType.create({
        data: createQuestionTypeDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // Unique constraint violation (e.g., name already exists)
        throw new ConflictException(
          `名称为 '${createQuestionTypeDto.name}' 的问题类型已存在。`,
        );
      }
      throw error;
    }
  }

  async findAllPaginated(
    query: FindQuestionTypesQueryDto,
  ): Promise<{ list: QuestionType[]; total: number }> {
    const {
      current = 1,
      pageSize = 10,
      name,
      sortBy,
      sortOrder = 'asc',
    } = query;
    const skip = (current - 1) * pageSize;
    const where: Prisma.QuestionTypeWhereInput = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const orderBy: Prisma.QuestionTypeOrderByWithRelationInput[] = [];
    if (sortBy) {
      orderBy.push({ [sortBy]: sortOrder.toLowerCase() as Prisma.SortOrder });
    } else {
      orderBy.push({ createdAt: 'desc' }); // Default sort
    }

    const [list, total] = await this.prisma.$transaction([
      this.prisma.questionType.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      this.prisma.questionType.count({ where }),
    ]);
    return { list, total };
  }

  // Method to get all types (id and name only) as requested for dropdowns etc.
  async findAllLite(): Promise<{ id: number; name: string }[]> {
    return await this.prisma.questionType.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number): Promise<QuestionType | null> {
    const questionType = await this.prisma.questionType.findUnique({
      where: { id },
    });
    if (!questionType) {
      throw new NotFoundException(`ID 为 ${id} 的问题类型未找到。`);
    }
    return questionType;
  }

  async update(
    id: number,
    updateQuestionTypeDto: UpdateQuestionTypeDto,
  ): Promise<QuestionType> {
    try {
      return await this.prisma.questionType.update({
        where: { id },
        data: updateQuestionTypeDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // Record to update not found
          throw new NotFoundException(`ID 为 ${id} 的问题类型未找到。`);
        }
        if (error.code === 'P2002') {
          // Unique constraint violation for name
          throw new ConflictException(
            `名称为 '${updateQuestionTypeDto.name}' 的问题类型已存在。`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: number): Promise<QuestionType> {
    // Check if any questions are associated with this type
    const associatedQuestionsCount = await this.prisma.sectionQuestion.count({
      where: { questionTypeId: id },
    });

    if (associatedQuestionsCount > 0) {
      throw new ConflictException(
        `无法删除 ID 为 ${id} 的问题类型，因为它已关联到 ${associatedQuestionsCount} 个问题。请先解除关联或删除这些问题。`,
      );
    }

    try {
      return await this.prisma.questionType.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`ID 为 ${id} 的问题类型未找到。`);
      }
      throw error;
    }
  }
}
