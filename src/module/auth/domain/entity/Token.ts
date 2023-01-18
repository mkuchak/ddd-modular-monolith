import { config } from "~/shared/config";
import { container } from "~/shared/infra/container";
import { IDate } from "~/shared/infra/container/provider/Date/IDate";
import { IJwt } from "~/shared/infra/container/provider/Jwt/IJwt";

export type ITokenProps = ClassProps<Token>;

export class Token {
  payload?: any;
  value?: string;
  expiration?: number;
  secret?: string;

  constructor(
    props: ITokenProps,
    private readonly jwt: IJwt = container.get("jwt"),
    private readonly date: IDate = container.get("date")
  ) {
    Object.assign(this, props);
  }

  async isValid(): Promise<boolean> {
    return await this.jwt.verify(await this.getValue(), this.secret || config.auth.jwtSecret);
  }

  async getValue(): Promise<string> {
    return await this.jwt.sign(
      {
        ...this.payload,
        exp: this.date.addMinutes(new Date(), this.expiration || config.auth.jwtExpiration).getTime() / 1000,
      },
      this.secret || config.auth.jwtSecret
    );
  }

  async getPayload(): Promise<any> {
    return await this.jwt.decode(await this.getValue());
  }
}
