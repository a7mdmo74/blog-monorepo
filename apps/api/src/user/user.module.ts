import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver.js';
import { UserService } from './user.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
