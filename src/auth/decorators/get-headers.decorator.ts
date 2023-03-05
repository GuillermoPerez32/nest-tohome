import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetHeader = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { rawHeaders } = request;
  return rawHeaders;
});
