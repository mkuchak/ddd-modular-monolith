export interface IJwt {
  sign(payload: any, secret: string): Promise<string>;
  verify(token: string, secret: string): Promise<boolean>;
  decode(token: string): Promise<any>;
}
