import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../type/policies.type';

export const POLICIES_KEY = 'check_policy';

export function CheckPolicies(...handlers: PolicyHandler[]): CustomDecorator {
  return SetMetadata(POLICIES_KEY, handlers);
}
