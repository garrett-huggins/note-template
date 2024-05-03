import { Module } from '@nestjs/common';
import { AdminModule } from './api/admin/admin.module';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './api/profile/profile.module';
import { UsersModule } from './api/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    AdminModule,
    ProfileModule,
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}
