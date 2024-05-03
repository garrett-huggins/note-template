import { Controller, UseGuards, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiOAuth2, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { UserGuard } from 'src/guards/user.guard';
import { CurrentUser, CurrentUserType } from 'src/util/user.decorator';
import { ProfileEntity } from '../../entities/profile.entity';

@UseGuards(UserGuard)
@ApiOAuth2([])
@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOkResponse({ type: ProfileEntity })
  getProfile(@CurrentUser() user: CurrentUserType) {
    return this.profileService.getProfile(user.data.id);
  }
}
