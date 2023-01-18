import { IUserRepository } from "~/module/auth/domain/repository/IUserRepository";

export interface IAuthRepositoryFactory {
  createUserRepository(): IUserRepository;
}
