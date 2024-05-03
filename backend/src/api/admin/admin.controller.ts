import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOkResponse, ApiOAuth2 } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/user.entity';
import { AdminGuard } from 'src/guards/admin.guard';

@UseGuards(AdminGuard)
@ApiOAuth2([])
@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly userService: AdminService) {}

  @Get('users')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.userService.findAll();
  }

  @Get('users/:id')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('users/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
