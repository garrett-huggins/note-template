import { Injectable } from '@nestjs/common';
import { ProfileEntity } from '../../entities/profile.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(user_id: string): Promise<ProfileEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    return new ProfileEntity(user);
  }
}
