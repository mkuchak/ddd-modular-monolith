import { nanoid } from "nanoid";
import { Email } from "~/module/auth/domain/entity/Email";
import { Password } from "~/module/auth/domain/entity/Password";
import { Session } from "~/module/auth/domain/entity/Session";

export type IUserProps = ClassProps<
  User,
  {
    email: string;
    password: string;
  }
>;

export class User {
  id?: string = nanoid();
  email: Email;
  password: Password;
  name?: string;
  picture?: string;
  isActive?: boolean = true;
  emailVerifiedAt?: Date;
  session?: Session[] = [];

  constructor(props: IUserProps) {
    Object.assign(this, props);
    this.email = new Email(props.email);
    this.password = new Password(props.password);
  }

  addSession(session: Session): void {
    this.session?.push(session);
  }
}
