import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  Subject,
} from '@casl/ability';

@Injectable()
export class AbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    user?.role?.permissions.forEach((rule) => {
      can(rule.action, rule.subject);
    });


    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subject>,
    });
  }
}
