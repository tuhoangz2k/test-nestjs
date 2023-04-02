import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Observable } from 'rxjs';
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
