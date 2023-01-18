import { StatusCodes } from "http-status-codes";
import { GetUser } from "~/module/auth/application/usecase/GetUser";
import { SignIn } from "~/module/auth/application/usecase/SignIn";
import { SignUp } from "~/module/auth/application/usecase/SignUp";
import { IAuthRepositoryFactory } from "~/module/auth/domain/factory/IAuthRepositoryFactory";
import { container } from "~/shared/infra/container";

export class AuthController {
  constructor(
    private readonly authRepositoryFactory: IAuthRepositoryFactory = container.get("authRepositoryFactory")
  ) {}

  async signUp({ body }: Context): Promise<Reply> {
    const input = {
      email: body.email,
      password: body.password,
      name: body.name,
    };

    const signUp = new SignUp(this.authRepositoryFactory);
    const output = await signUp.execute(input);

    return {
      status: StatusCodes.CREATED,
      json: output,
    };
  }

  async signIn({ body, headers, custom }: Context): Promise<Reply> {
    const input = {
      email: body.email,
      password: body.password,
      userAgent: headers["user-agent"],
      lastIp: custom.ip,
    };

    const signIn = new SignIn(this.authRepositoryFactory);
    const output = await signIn.execute(input);

    return {
      status: StatusCodes.OK,
      json: output,
    };
  }

  async me({ custom }: Context): Promise<Reply> {
    const input = {
      id: custom.userId,
    };

    const getUser = new GetUser(this.authRepositoryFactory);
    const output = await getUser.execute(input);

    return {
      status: StatusCodes.OK,
      json: output,
    };
  }
}
