import { faker } from "@faker-js/faker";
import { sessionDtoFactory } from "^/factory/sessionDtoFactory";
import { userDtoFactory } from "^/factory/userDtoFactory";
import { Session } from "~/module/auth/domain/entity/Session";
import { GetUser } from "~/module/auth/application/usecase/GetUser";
import { IUserProps, User } from "~/module/auth/domain/entity/User";
import { IAuthRepositoryFactory } from "~/module/auth/domain/factory/IAuthRepositoryFactory";
import { IUserRepository } from "~/module/auth/domain/repository/IUserRepository";
import { AuthRepositoryFactoryMemory } from "~/module/auth/infra/factory/AuthRepositoryFactoryMemory";

let authRepositoryFactory: IAuthRepositoryFactory;
let userRepository: IUserRepository;
let getUser: GetUser;
let userDto: IUserProps;
let user: User;

beforeEach(async () => {
  authRepositoryFactory = new AuthRepositoryFactoryMemory();
  userRepository = authRepositoryFactory.createUserRepository();
  getUser = new GetUser(authRepositoryFactory);
  userDto = userDtoFactory();
  user = new User(userDto);
  await user.password.hash();
  await userRepository.save(user);
});

describe("GetUser", () => {
  it("should get a user", async () => {
    const output = await getUser.execute({ id: user.id });

    expect(output).toEqual({
      id: user.id,
      email: user.email.value,
      name: user.name,
      picture: user.picture,
      isActive: user.isActive,
      emailVerifiedAt: user.emailVerifiedAt,
      session: user.session,
    });
  });

  it("should get a user with session", async () => {
    const sessionDto = sessionDtoFactory();
    const session = new Session(sessionDto);
    user.addSession(session);
    await userRepository.save(user);

    const output = await getUser.execute({ id: user.id });

    expect(output).toEqual({
      id: user.id,
      email: user.email.value,
      name: user.name,
      picture: user.picture,
      isActive: user.isActive,
      emailVerifiedAt: user.emailVerifiedAt,
      session: [
        {
          value: session.value,
          lastIp: session.lastIp,
          userAgent: session.userAgent,
          expiresAt: session.expiresAt,
        },
      ],
    });
  });

  it("should not get a user with an invalid id", () => {
    expect(getUser.execute({ id: faker.datatype.uuid() })).rejects.toThrowError("User Not Found");
  });
});
