import { IAuthRepositoryFactory } from "~/module/auth/domain/factory/IAuthRepositoryFactory";
import { IUserRepository } from "~/module/auth/domain/repository/IUserRepository";
import { UserRepositoryMemory } from "~/module/auth/infra/repository/memory/UserRepositoryMemory";

export class AuthRepositoryFactoryMemory implements IAuthRepositoryFactory {
  createUserRepository(): IUserRepository {
    return new UserRepositoryMemory();
  }
}
