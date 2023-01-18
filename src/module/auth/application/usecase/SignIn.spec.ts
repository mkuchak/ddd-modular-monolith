import { faker } from "@faker-js/faker";
import { SignIn } from "~/module/auth/application/usecase/SignIn";
import { User, IUserProps } from "~/module/auth/domain/entity/User";
import { UserRepositoryMemory } from "~/module/auth/infra/repository/memory/UserRepositoryMemory";
import { userDtoFactory } from "../../../../../test/factory/userDtoFactory";
import { IAuthRepositoryFactory } from "~/module/auth/domain/factory/IAuthRepositoryFactory";
import { AuthRepositoryFactoryMemory } from "~/module/auth/infra/factory/AuthRepositoryFactoryMemory";
import { IUserRepository } from "~/module/auth/domain/repository/IUserRepository";

let authRepositoryFactory: IAuthRepositoryFactory;
let userRepository: IUserRepository;
let signIn: SignIn;
let userDto: IUserProps;
let user: User;

beforeEach(async () => {
  authRepositoryFactory = new AuthRepositoryFactoryMemory();
  userRepository = authRepositoryFactory.createUserRepository();
  signIn = new SignIn(authRepositoryFactory);
  userDto = userDtoFactory();
  user = new User(userDto);
  await user.password.hash();
  await userRepository.save(user);
});

describe("SignIn", () => {
  it("should sign in a user", async () => {
    const output = await signIn.execute({
      ...userDto,
      lastIp: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
    });

    expect(output).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it("should not sign in a user with an invalid email", () => {
    expect(
      signIn.execute({
        email: faker.internet.email(),
        password: userDto.password,
      })
    ).rejects.toThrowError("Invalid Credentials");
  });

  it("should not sign in a user with an invalid password", () => {
    expect(
      signIn.execute({
        email: userDto.email,
        password: faker.internet.password(),
      })
    ).rejects.toThrowError("Invalid Credentials");
  });

  it("should not sign in a user with an inactive account", async () => {
    const inactiveUserDto = userDtoFactory();
    const inactiveUser = new User({ ...inactiveUserDto, isActive: false });
    await inactiveUser.password.hash();
    await userRepository.save(inactiveUser);

    expect(
      signIn.execute({
        email: inactiveUserDto.email,
        password: inactiveUserDto.password,
      })
    ).rejects.toThrowError("User Is Not Active");
  });
});
