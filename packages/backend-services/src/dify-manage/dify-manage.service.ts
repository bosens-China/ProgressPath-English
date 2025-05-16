import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDifyManageDto } from './dto/create-dify-manage.dto';
import { UpdateDifyManageDto } from './dto/update-dify-manage.dto';
import { FindDifyManageQueryDto } from './dto/find-dify-manage-query.dto';
import { DifyManage, Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import * as _ from 'lodash';

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
      data: createDifyManageDto as any,
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
    const { current = 1, pageSize = 10, description, apiUrl, name } = query;

    const where: Prisma.DifyManageWhereInput = {};

    if (description) {
      where.description = { contains: description };
    }

    if (apiUrl) {
      where.apiUrl = { contains: apiUrl };
    }

    if (name) {
      where.name = { contains: name };
    }

    const list = await this.prisma.difyManage.findMany({
      where,
      skip: (current - 1) * pageSize,
      take: pageSize,
    });

    const total = await this.prisma.difyManage.count({ where });

    return { list, total };
  }

  /**
   * @description 获取所有Dify管理列表
   * @returns DifyManage[]
   */
  async findAll(): Promise<DifyManage[]> {
    return this.prisma.difyManage.findMany({
      orderBy: { id: 'asc' },
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
      throw new NotFoundException(`Dify管理 #${id} 不存在`);
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
    // 先检查是否存在
    await this.findOne(id);

    return await this.prisma.difyManage.update({
      where: { id },
      data: updateDifyManageDto as any,
    });
  }

  /**
   * @description 删除Dify管理
   * @param id Dify管理ID
   * @returns DifyManage
   * @throws NotFoundException 如果未找到
   */
  async remove(id: number): Promise<DifyManage> {
    // 先检查是否存在
    await this.findOne(id);

    return await this.prisma.difyManage.delete({
      where: { id },
    });
  }

  /**
   * @description 处理代理请求
   * @param id Dify管理ID
   * @param req 请求对象
   * @param res 响应对象
   */
  async proxyRequest(id: number, req: Request, res: Response): Promise<void> {
    const difyManage = await this.findOne(id);
    if (!difyManage || !difyManage.apiUrl) {
      res.status(404).send('Dify 接口不存在');
      return;
    }
    // 终止标识符
    let isAborted = false;
    /*
     * 对body参数进行检查，以及合并
     */

    const reqBody = _.isObjectLike(req.body) ? req.body : {};
    const body = Object.entries(difyManage.body || {}).reduce(
      (obj, [key, value]) => {
        if (_.isString(value) && value.startsWith('$')) {
          // 检查是否存在，如果不存在直接结束
          if (!reqBody[value]) {
            isAborted = true;
            res.status(400).send(`请求参数 ${value} 不存在`);
          } else {
            obj[key] = reqBody[value];
          }
          return obj;
        }
        obj[key] = value;

        return obj;
      },
      {} as Record<string, any>,
    );
    if (isAborted) {
      return;
    }

    const proxyRes = await fetch(difyManage.apiUrl, {
      method: req.method || 'POST',
      headers: {
        ...((difyManage.headers as any) || {}),
        accept: 'text/event-stream, application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${difyManage.token}`,
      },
      body: JSON.stringify(body),
    });

    const contentType = proxyRes.headers.get('content-type') || '';

    if (contentType.includes('text/event-stream')) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      // ✅ 将 Web ReadableStream 转为 Node.js Stream
      const webStream = proxyRes.body;
      if (webStream) {
        const reader = webStream.getReader();

        const push = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };

        push().catch((e) => {
          console.error('Stream error', e);
          res.end();
        });
      } else {
        res.end();
      }
    } else {
      res.setHeader('Content-Type', contentType);
      res.status(proxyRes.status);

      const arrayBuffer = await proxyRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    }
  }
}
