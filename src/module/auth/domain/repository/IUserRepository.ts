import { User } from "~/domain/entity/User";

export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  findAll(): Promise<User[]>;
}
