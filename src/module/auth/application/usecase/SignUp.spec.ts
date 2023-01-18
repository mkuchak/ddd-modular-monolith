import { userDtoFactory } from "^/factory/userDtoFactory";
import { SignUp } from "~/module/auth/application/usecase/SignUp";
import { IAuthRepositoryFactory } from "~/module/auth/domain/factory/IAuthRepositoryFactory";
import { AuthRepositoryFactoryMemory } from "~/module/auth/infra/factory/AuthRepositoryFactoryMemory";

let authRepositoryFactory: IAuthRepositoryFactory;
let signUp: SignUp;

beforeAll(() => {
  authRepositoryFactory = new AuthRepositoryFactoryMemory();
  signUp = new SignUp(authRepositoryFactory);
});

describe("SignUp", () => {
  it("should create a new user account", async () => {
    const input = userDtoFactory();
    const output = await signUp.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      email: input.email,
      name: input.name,
    });
  });

  it("should not create a new user account with an existing email", async () => {
    const input = userDtoFactory();
    await signUp.execute(input);

    expect(signUp.execute(input)).rejects.toThrowError("Email Already Exists");
  });
});
