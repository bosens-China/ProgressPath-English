import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { Public } from '../auth/public.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.login(
      adminLoginDto.username,
      adminLoginDto.password,
    );
  }
}
