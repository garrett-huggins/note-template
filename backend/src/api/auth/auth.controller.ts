import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  PasswordDto,
  ForgotPasswordDto,
  ForgotPasswordResDto,
} from './dto/password.dto';
import { OauthDto } from './dto/oauth.dto';
import { UserEntity } from 'src/entities/user.entity';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import * as sgMail from '@sendgrid/mail';
import { templates } from 'src/config/templates';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/register')
  @ApiOkResponse({ type: UserEntity })
  async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    const user = await this.authService.register(registerDto);
    if (process.env.USE_EMAILS) {
      const email = registerDto.email;
      const msg: sgMail.MailDataRequired = {
        to: email,
        from: process.env.SENDGRID_EMAIL,
        subject: 'Registration Confirmation',
        templateId: templates.registration,
        dynamicTemplateData: {
          project: 'NestJS API',
          name: user.first_name,
        },
      };
      sgMail.send(msg);
    }
    return user;
  }

  @Post('user/login')
  @ApiOkResponse({ type: LoginResDto })
  login(@Body() loginDto: LoginDto): Promise<LoginResDto> {
    return this.authService.login(loginDto);
  }

  @Post('docs/login')
  @ApiOkResponse({ type: LoginResDto })
  loginDocs(@Body() oauthDto: OauthDto): Promise<LoginResDto> {
    return this.authService.login({
      email: oauthDto.username,
      password: oauthDto.password,
    });
  }

  @Post('user/password/forgot')
  @ApiOkResponse({ type: ForgotPasswordResDto })
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): string | { reset_token: string } {
    const res = this.authService.forgotPassword(forgotPasswordDto.email);
    if (process.env.USE_EMAILS) {
      const msg: sgMail.MailDataRequired = {
        to: forgotPasswordDto.email,
        from: process.env.SENDGRID_EMAIL,
        subject: 'Password Reset',
        templateId: templates.passwordReset,
        dynamicTemplateData: {
          reset_token: res.reset_token,
        },
      };
      sgMail.send(msg);
    }
    return res;
  }

  @Post('user/password/reset')
  resetPassword(@Body() passwordDto: PasswordDto): string {
    this.authService.resetPassword(passwordDto);
    return 'Password reset successful';
  }
}
