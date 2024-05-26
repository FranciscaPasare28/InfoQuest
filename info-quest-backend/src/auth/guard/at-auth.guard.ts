import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PUBLIC_ROUTE } from '../decorator/public-route.decorator';

@Injectable()
export class AtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicRoute = this.isPublicRoute(context);

    if (isPublicRoute) {
      return true;
    }

    return super.canActivate(context);
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    const routeMetadata = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    return !!routeMetadata;
  }
}
