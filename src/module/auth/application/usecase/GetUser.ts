import { StatusCodes } from "http-status-codes";
import { ISessionProps } from "~/module/auth/domain/entity/Session";
import { IAuthRepositoryFactory } from "~/module/auth/domain/factory/IAuthRepositoryFactory";
import { IUserRepository } from "~/module/auth/domain/repository/IUserRepository";
import { HttpError } from "~/shared/error/HttpError";
import { container } from "~/shared/infra/container";

export interface IGetUserInput {
  id: string;
}

export interface IGetUserOutput {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  isActive: boolean;
  emailVerifiedAt?: Date;
  session?: {
    value: string;
    lastIp: string;
    userAgent: string;
    expiresAt: Date;
  }[];
}

export class GetUser {
  private readonly userRepository: IUserRepository;

  constructor(private readonly authRepositoryFactory: IAuthRepositoryFactory = container.get("authRepositoryFactory")) {
    this.userRepository = this.authRepositoryFactory.createUserRepository();
  }

  async execute(input: IGetUserInput): Promise<IGetUserOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new HttpError("User Not Found", StatusCodes.NOT_FOUND);
    }

    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      picture: user.picture,
      isActive: user.isActive,
      emailVerifiedAt: user.emailVerifiedAt,
      session: user.session?.map((session: ISessionProps) => ({
        value: session.value,
        lastIp: session.lastIp,
        userAgent: session.userAgent,
        expiresAt: session.expiresAt,
      })),
    };
  }
}
