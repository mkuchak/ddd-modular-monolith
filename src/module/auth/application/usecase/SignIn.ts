import { StatusCodes } from "http-status-codes";
import { Session } from "~/module/auth/domain/entity/Session";
import { IAuthRepositoryFactory } from "~/module/auth/domain/factory/IAuthRepositoryFactory";
import { IUserRepository } from "~/module/auth/domain/repository/IUserRepository";
import { TokenIssuer } from "~/module/auth/domain/service/TokenIssuer";
import { config } from "~/shared/config";
import { HttpError } from "~/shared/error/HttpError";
import { container } from "~/shared/infra/container";
import { IDate } from "~/shared/infra/container/provider/Date/IDate";

export interface ISignInInput {
  email: string;
  password: string;
  lastIp?: string;
  userAgent?: string;
}

export interface ISignInOutput {
  accessToken: string;
  refreshToken: string;
}

export class SignIn {
  private readonly userRepository: IUserRepository;

  constructor(
    private readonly authRepositoryFactory: IAuthRepositoryFactory = container.get("authRepositoryFactory"),
    private readonly date: IDate = container.get("date")
  ) {
    this.userRepository = this.authRepositoryFactory.createUserRepository();
  }

  async execute(input: ISignInInput): Promise<ISignInOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new HttpError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new HttpError("User Is Not Active", StatusCodes.UNAUTHORIZED);
    }

    const isValidPassword = await user.password.verify(input.password);

    if (!isValidPassword) {
      throw new HttpError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
    }

    // const token = new Token({ payload: { id: user.id } }); // as domain entity
    const accessToken = await TokenIssuer.issue({ id: user.id }); // as domain service

    const session = new Session({
      lastIp: input.lastIp,
      userAgent: input.userAgent,
      expiresAt: this.date.addDays(new Date(), config.auth.refreshTokenExpiration),
    });

    user.addSession(session);

    await this.userRepository.save(user);

    return {
      // accessToken: await token.getValue(), // as domain entity
      accessToken, // as domain service
      refreshToken: session.value,
    };
  }
}
