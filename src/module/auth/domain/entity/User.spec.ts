import { faker } from "@faker-js/faker";
import { userDtoFactory } from "^/factory/userDtoFactory";
import { User } from "~/module/auth/domain/entity/User";

describe("User", () => {
  it("should create a new user", () => {
    const userDto = userDtoFactory();
    const user = new User(userDto);

    expect(user).toHaveProperty("id");
    expect(user.email.value).toBe(userDto.email);
    expect(user.password.value).toBe(userDto.password);
    expect(user).toHaveProperty("isActive", true);
  });

  it("should create a new user with a custom id", () => {
    const userDtoWithId = { ...userDtoFactory(), id: faker.datatype.uuid() };
    const user = new User(userDtoWithId);

    expect(user).toHaveProperty("id", userDtoWithId.id);
    expect(user.email.value).toBe(userDtoWithId.email);
    expect(user.password.value).toBe(userDtoWithId.password);
  });
});
