import { createParamDecorator } from '@nestjs/common';
import { UserDoc } from './interfaces/user-document.interface';

export const GetUser = createParamDecorator(
  (_data, req): UserDoc => {
    return req.user;
  }
);
