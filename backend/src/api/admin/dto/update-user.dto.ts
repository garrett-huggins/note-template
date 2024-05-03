import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  last_name: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_admin: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
