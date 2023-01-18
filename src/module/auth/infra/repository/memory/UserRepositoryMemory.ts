import { User } from "~/module/auth/domain/entity/User";
import { IUserRepository } from "~/module/auth/domain/repository/IUserRepository";

export class UserRepositoryMemory implements IUserRepository {
  private static instance: UserRepositoryMemory;

  constructor(private readonly users: User[] = []) {
    if (UserRepositoryMemory.instance) {
      return UserRepositoryMemory.instance;
    }

    UserRepositoryMemory.instance = this;
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === user.id);

    if (userIndex >= 0) {
      this.users[userIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email.value === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}
