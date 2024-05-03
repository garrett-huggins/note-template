import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserGuard } from './user.guard';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard extends UserGuard {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = this.jwtService.decode(token);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub.id },
    });

    if (!user || !payload) {
      throw new UnauthorizedException();
    }

    if (!user.is_admin) {
      throw new UnauthorizedException('User lacks enough permissions');
    }

    return true;
  }
}
