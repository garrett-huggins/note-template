import { Injectable, ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }
    return new UserEntity(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new ConflictException('User not found');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
    return new UserEntity(user);
  }

  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new ConflictException('User not found');
    }

    const user = await this.prisma.user.delete({
      where: { id },
    });
    return new UserEntity(user);
  }
}
