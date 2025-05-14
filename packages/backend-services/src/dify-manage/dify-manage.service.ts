import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDifyManageDto } from './dto/create-dify-manage.dto';
import { UpdateDifyManageDto } from './dto/update-dify-manage.dto';
import { FindDifyManageQueryDto } from './dto/find-dify-manage-query.dto';
import { DifyManage, Prisma } from '@prisma/client';

@Injectable()
export class DifyManageService {
  constructor(private prisma: PrismaService) {}

  /**
   * @description 创建Dify管理
   * @param createDifyManageDto 创建Dify管理DTO
   * @returns DifyManage
   */
  async create(createDifyManageDto: CreateDifyManageDto): Promise<DifyManage> {
    return this.prisma.difyManage.create({
      data: createDifyManageDto,
    });
  }

  /**
   * @description 分页查询Dify管理列表
   * @param query 查询参数
   * @returns { total: number, list: DifyManage[] }
   */
  async findAllPaginated(
    query: FindDifyManageQueryDto,
  ): Promise<{ total: number; list: DifyManage[] }> {
    const { current = 1, pageSize = 10, description, apiUrl } = query;
    const skip = (current - 1) * pageSize;

    const where: Prisma.DifyManageWhereInput = {};

    if (description) {
      where.description = { contains: description, mode: 'insensitive' };
    }

    if (apiUrl) {
      where.apiUrl = { contains: apiUrl, mode: 'insensitive' };
    }

    const [list, total] = await this.prisma.$transaction([
      this.prisma.difyManage.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.difyManage.count({ where }),
    ]);

    return { total, list };
  }

  /**
   * @description 获取所有Dify管理列表
   * @returns DifyManage[]
   */
  async findAll(): Promise<DifyManage[]> {
    return this.prisma.difyManage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * @description 根据ID查找Dify管理
   * @param id Dify管理ID
   * @returns DifyManage
   * @throws NotFoundException 如果未找到
   */
  async findOne(id: number): Promise<DifyManage> {
    const difyManage = await this.prisma.difyManage.findUnique({
      where: { id },
    });

    if (!difyManage) {
      throw new NotFoundException(`ID为 ${id} 的Dify管理未找到`);
    }

    return difyManage;
  }

  /**
   * @description 更新Dify管理
   * @param id Dify管理ID
   * @param updateDifyManageDto 更新Dify管理DTO
   * @returns DifyManage
   * @throws NotFoundException 如果未找到
   */
  async update(
    id: number,
    updateDifyManageDto: UpdateDifyManageDto,
  ): Promise<DifyManage> {
    try {
      return await this.prisma.difyManage.update({
        where: { id },
        data: updateDifyManageDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`ID为 ${id} 的Dify管理未找到`);
      }
      throw error;
    }
  }

  /**
   * @description 删除Dify管理
   * @param id Dify管理ID
   * @returns DifyManage
   * @throws NotFoundException 如果未找到
   */
  async remove(id: number): Promise<DifyManage> {
    try {
      return await this.prisma.difyManage.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`ID为 ${id} 的Dify管理未找到`);
      }
      throw error;
    }
  }
}
