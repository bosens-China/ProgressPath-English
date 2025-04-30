import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateAdminToken(id: number, username: string) {
    const payload = { sub: id, username, type: 'admin' };
    return await this.jwtService.signAsync(payload);
  }

  async generateUserToken(id: number, phone: string) {
    const payload = { sub: id, phone, type: 'user' };
    return await this.jwtService.signAsync(payload);
  }
}
