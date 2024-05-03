import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ProfileEntity {
  // The Partial<ProfileEntity> type allows us to create a new ProfileEntity instance with only the properties we need.
  constructor(partial: Partial<ProfileEntity>) {
    Object.assign(this, partial);
  }

  @Exclude()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  is_admin: boolean;

  @Exclude()
  is_active: boolean;

  // Hide the hashed password from the response
  @Exclude()
  hashed_password: string;
}
