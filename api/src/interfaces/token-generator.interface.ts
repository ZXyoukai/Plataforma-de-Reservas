export interface ITokenGenerator {
  generate(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}
