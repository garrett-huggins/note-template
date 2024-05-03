import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  // The Partial<UserEntity> type allows us to create a new UserEntity instance with only the properties we need.
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  is_admin: boolean;

  @ApiProperty()
  is_active: boolean;

  // Hide the hashed password from the response
  @Exclude()
  hashed_password: string;
}
