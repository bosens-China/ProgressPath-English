import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [AuthModule, SmsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
