import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

/**
 * CurrentUserType
 * @example
 * export interface CurrentUserType {
  data: {
    id: string;
    is_admin: boolean;
  };
  username: string;
}
 */
export interface CurrentUserType {
  data: {
    id: string;
  };
  username: string;
}

export const CurrentUser = () =>
  createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentUserType = request.user;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  })();
