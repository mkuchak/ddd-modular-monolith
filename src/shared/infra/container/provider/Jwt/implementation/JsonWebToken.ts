import jwt from "jsonwebtoken";
import { IJwt } from "~/shared/infra/container/provider/Jwt/IJwt";

export class JsonWebToken implements IJwt {
  async sign(payload: any, secret: string): Promise<string> {
    return jwt.sign(payload, secret);
  }

  async verify(token: string, secret: string): Promise<boolean> {
    try {
      jwt.verify(token, secret);
      return true;
    } catch {
      return false;
    }
  }

  async decode(token: string): Promise<any> {
    return jwt.decode(token);
  }
}
