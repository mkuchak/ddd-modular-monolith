import { faker } from "@faker-js/faker";

interface UserDtoFactory {
  email?: string;
  password?: string;
  name?: string;
}

export const userDtoFactory = ({
  email,
  password,
  name,
}: UserDtoFactory = {}) => ({
  email: email ?? faker.internet.email(),
  password: password ?? faker.internet.password(8, false, /\w/, "1@Aa"),
  name: name ?? faker.name.firstName(),
});
