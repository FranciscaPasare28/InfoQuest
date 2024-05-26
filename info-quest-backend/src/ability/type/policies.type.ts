import { AnyMongoAbility } from '@casl/ability';

interface IPolicyHandler {
  handle?: (ability: AnyMongoAbility) => boolean;
}

export type PolicyHandler =
  | IPolicyHandler
  | ((ability: AnyMongoAbility) => boolean);
