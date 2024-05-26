import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestUser = createParamDecorator(
  (data: string, executionContext: ExecutionContext) => {
    const request = executionContext.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
