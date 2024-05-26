export class TokenPayload {
  sub: string;
  type?: number;

  iat: number;

  exp: number;
}

export type TokenData = Partial<TokenPayload>;
