import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}
  async login(
    username: string,
    password: string,
  ): Promise<{
    access_token: string;
    username: string;
  }> {
    const admin = await this.prisma.admin.findUnique({ where: { username } });
    if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
      throw new Error('Invalid admin credentials');
    }

    return {
      access_token: await this.authService.generateAdminToken(
        admin.id,
        admin.username,
      ),
      username: admin.username,
    };
  }
}
