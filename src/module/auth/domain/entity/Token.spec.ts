import { faker } from "@faker-js/faker";
import { Token } from "~/module/auth/domain/entity/Token";

let validToken: Token;
let invalidToken: Token;
const payload = { id: faker.datatype.uuid() };

beforeAll(() => {
  validToken = new Token({ payload });
  invalidToken = new Token({ payload, expiration: -1 });
});

describe("Token", () => {
  it("should issue a token", async () => {
    expect(await validToken.getValue()).toMatch(/^(?:[\w-]*\.){2}[\w-]*$/);
  });

  it("should verify a valid token", async () => {
    expect(await validToken.isValid()).toBe(true);
  });

  it("should not verify an invalid token", async () => {
    expect(await invalidToken.isValid()).toBe(false);
  });

  it("should decode a token", async () => {
    expect(await invalidToken.getPayload()).toMatchObject(payload);
  });
});
