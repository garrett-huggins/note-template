import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { LoginDto, LoginResDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordDto } from './dto/password.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, comparePassword } from 'src/util/security';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: registerDto.email,
      },
      select: {
        id: true,
      },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    // exclude password from the user object
    const { password, ...data } = registerDto;
    const hashedPassword = hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        hashed_password: hashedPassword,
      },
    });

    return new UserEntity(user);
  }

  async login(loginDto: LoginDto): Promise<LoginResDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordValid = comparePassword(
      loginDto.password,
      user.hashed_password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const payload = {
      username: user.email,
      sub: { id: user.id },
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
      user: new UserEntity(user),
    };
  }

  forgotPassword(email: string): { reset_token: string } {
    const token = this.jwtService.sign({ email });
    return { reset_token: token };
  }

  async resetPassword(passwordDto: PasswordDto): Promise<UserEntity> {
    const { reset_token, password } = passwordDto;
    const decoded = this.jwtService.verify(reset_token);
    if (!decoded.email) {
      throw new HttpException('Invalid token', 401);
    }

    const user = await this.prisma.user.findFirst({
      where: {
        email: decoded.email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const hashedPassword = hashPassword(password);
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashed_password: hashedPassword,
      },
    });

    return new UserEntity(updatedUser);
  }
}
