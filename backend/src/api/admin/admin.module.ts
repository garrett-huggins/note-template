import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/api/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    PrismaService,
    ConfigService,
    UsersService,
    JwtService,
  ],
})
export class AdminModule {}
