import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async findAllPaginated(
    query: FindUsersQueryDto,
  ): Promise<{ list: User[]; total: number }> {
    const {
      current = 1,
      pageSize = 10,
      phone,
      nickname,
      registrationDateFrom,
      registrationDateTo,
      sortBy,
      sortOrder = 'asc',
    } = query;

    const skip = (current - 1) * pageSize;
    const where: Prisma.UserWhereInput = {};

    if (phone) {
      // where.phone = phone;
      where.phone = { contains: phone, mode: 'insensitive' };
    }

    if (nickname) {
      where.nickname = { contains: nickname, mode: 'insensitive' };
    }

    if (registrationDateFrom || registrationDateTo) {
      where.registrationDate = {};
      if (registrationDateFrom) {
        where.registrationDate.gte = new Date(registrationDateFrom);
      }
      if (registrationDateTo) {
        const toDate = new Date(registrationDateTo);
        toDate.setHours(23, 59, 59, 999);
        where.registrationDate.lte = toDate;
      }
    }

    const orderBy: Prisma.UserOrderByWithRelationInput[] = [];
    if (sortBy) {
      orderBy.push({ [sortBy]: sortOrder.toLowerCase() as Prisma.SortOrder });
    } else {
      orderBy.push({ createdAt: 'desc' });
    }

    const [list, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { list, total };
  }

  async loginWithPhone(phone: string) {
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.create({
        phone,
      });
    }
    return {
      ...user,
      access_token: await this.authService.generateUserToken(
        user.id,
        user.phone,
      ),
    };
  }
}
