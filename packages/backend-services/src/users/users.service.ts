import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { Prisma, User } from '@prisma/client';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private smsService: SmsService,
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

  async loginWithPhone(phone: string, code: string) {
    // 先验证验证码
    const isCodeValid = await this.smsService.verifyCode(phone, code);
    if (!isCodeValid) {
      throw new UnauthorizedException('验证码无效或已过期');
    }

    // 验证通过后执行登录流程
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

  async updatePhone(id: number, updatePhoneDto: UpdatePhoneDto) {
    // 验证验证码
    const isCodeValid = await this.smsService.verifyCode(
      updatePhoneDto.newPhone,
      updatePhoneDto.code,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('验证码无效或已过期');
    }

    // 检查新手机号是否已被使用
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: updatePhoneDto.newPhone },
    });
    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException('该手机号已被其他用户使用');
    }

    // 更新手机号
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { phone: updatePhoneDto.newPhone },
    });

    // 生成新的 token
    return {
      ...updatedUser,
      access_token: await this.authService.generateUserToken(
        updatedUser.id,
        updatedUser.phone,
      ),
    };
  }
}
