import { nanoid } from "nanoid";
import { container } from "~/shared/infra/container";
import { IDate } from "~/shared/infra/container/provider/Date/IDate";

export type ISessionProps = ClassProps<Session>;

export class Session {
  value?: string = nanoid(128); // refreshToken
  lastIp?: string;
  userAgent?: string;
  expiresAt?: Date;

  constructor(props: ISessionProps, private date: IDate = container.get("date")) {
    Object.assign(this, props);
  }

  isExpired(): boolean {
    return !!this.expiresAt && this.date.isBefore(this.expiresAt, new Date());
  }

  refresh(expiredAt?: Date): void {
    this.value = nanoid(128);
    if (expiredAt) {
      this.expiresAt = expiredAt;
    }
  }
}
