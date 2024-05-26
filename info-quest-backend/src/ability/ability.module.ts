import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from './guard/policies.guard';

const providers = [
  AbilityFactory,
  {
    provide: APP_GUARD,
    useClass: PoliciesGuard,
  },
];

@Module({
  providers: [...providers],
  exports: [AbilityFactory],
})
export class AbilityModule {}
