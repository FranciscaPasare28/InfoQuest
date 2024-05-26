import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../ability.factory';
import { AnyMongoAbility } from '@casl/ability';
import { PolicyHandler } from '../type/policies.type';
import { POLICIES_KEY } from '../decorator/check-policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.getPolicyHandlers(context);
    if (!policyHandlers.length) return true;

    const ability = this.getUserAbility(context);
    return policyHandlers.every((handler) =>
      this.evaluatePolicyHandler(handler, ability),
    );
  }

  private getPolicyHandlers(context: ExecutionContext): PolicyHandler[] {
    return (
      this.reflector.get<PolicyHandler[]>(POLICIES_KEY, context.getHandler()) ||
      []
    );
  }

  private getUserAbility(context: ExecutionContext): AnyMongoAbility {
    const { user } = context.switchToHttp().getRequest();
    return this.abilityFactory.createForUser(user);
  }

  private evaluatePolicyHandler(
    handler: PolicyHandler,
    ability: AnyMongoAbility,
  ): boolean {
    return typeof handler === 'function'
      ? handler(ability)
      : handler.handle(ability);
  }
}
