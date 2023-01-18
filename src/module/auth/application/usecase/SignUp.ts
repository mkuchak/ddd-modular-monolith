import { StatusCodes } from "http-status-codes";
import { User } from "~/module/auth/domain/entity/User";
import { IAuthRepositoryFactory } from "~/module/auth/domain/factory/IAuthRepositoryFactory";
import { IUserRepository } from "~/module/auth/domain/repository/IUserRepository";
import { HttpError } from "~/shared/error/HttpError";
import { container } from "~/shared/infra/container";

export interface ISignUpInput {
  email: string;
  password: string;
  name?: string;
}

export interface ISignUpOutput {
  id: string;
  email: string;
  name?: string;
}

export class SignUp {
  private readonly userRepository: IUserRepository;

  constructor(private readonly authRepositoryFactory: IAuthRepositoryFactory = container.get("authRepositoryFactory")) {
    this.userRepository = this.authRepositoryFactory.createUserRepository();
  }

  async execute(input: ISignUpInput): Promise<ISignUpOutput> {
    const userAlreadyExists = await this.userRepository.findByEmail(input.email);

    if (userAlreadyExists) {
      throw new HttpError("Email Already Exists", StatusCodes.CONFLICT);
    }

    const user = new User(input);

    await user.password.hash();

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email.value,
      name: user?.name,
    };
  }
}
