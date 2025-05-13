import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { LoginWithPhoneDto } from './dto/login-with-phone.dto';
import { Public } from '../auth/public.decorator';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('list')
  findAllPaginated(@Query(ValidationPipe) query: FindUsersQueryDto) {
    return this.usersService.findAllPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Public()
  @Post('login-with-phone')
  async loginWithPhone(
    @Body(ValidationPipe) loginWithPhoneDto: LoginWithPhoneDto,
  ) {
    const userData = await this.usersService.loginWithPhone(
      loginWithPhoneDto.phone,
      loginWithPhoneDto.code,
    );
    return userData;
  }

  @Patch(':id/phone')
  updatePhone(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePhoneDto: UpdatePhoneDto,
  ) {
    return this.usersService.updatePhone(id, updatePhoneDto);
  }
}
