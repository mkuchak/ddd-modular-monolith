import { config } from "~/shared/config";
import { container } from "~/shared/infra/container";
import { IDate } from "~/shared/infra/container/provider/Date/IDate";
import { IJwt } from "~/shared/infra/container/provider/Jwt/IJwt";

export class TokenIssuer {
  static async issue(
    payload: any,
    expiration = config.auth.jwtExpiration,
    secret = config.auth.jwtSecret,
    jwt: IJwt = container.get("jwt"),
    date: IDate = container.get("date")
  ): Promise<string> {
    return await jwt.sign(
      {
        ...payload,
        exp: date.addMinutes(new Date(), expiration).getTime() / 1000,
      },
      secret
    );
  }

  static async verify(
    token: string,
    secret = config.auth.jwtSecret,
    jwt: IJwt = container.get("jwt")
  ): Promise<boolean> {
    return await jwt.verify(token, secret);
  }

  static async decode(token: string, jwt: IJwt = container.get("jwt")): Promise<any> {
    return await jwt.decode(token);
  }
}
