import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Word = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.word;
  },
);
