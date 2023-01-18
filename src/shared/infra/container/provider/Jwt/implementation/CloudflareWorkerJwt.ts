import jwt from "@tsndr/cloudflare-worker-jwt";
import { IJwt } from "~/shared/infra/container/provider/Jwt/IJwt";

export class CloudflareWorkerJwt implements IJwt {
  async sign(payload: any, secret: string): Promise<string> {
    return await jwt.sign(payload, secret);
  }

  async verify(token: string, secret: string): Promise<boolean> {
    return await jwt.verify(token, secret);
  }

  async decode(token: string): Promise<any> {
    return jwt.decode(token).payload;
  }
}
