import { faker } from "@faker-js/faker";
import { TokenIssuer } from "~/module/auth/domain/service/TokenIssuer";

let validToken: string;
let invalidToken: string;
const payload = { id: faker.datatype.uuid() };

beforeAll(async () => {
  validToken = await TokenIssuer.issue(payload);
  invalidToken = await TokenIssuer.issue(payload, -1);
});

describe("TokenIssuer", () => {
  it("should issue a token", () => {
    expect(validToken).toMatch(/^(?:[\w-]*\.){2}[\w-]*$/);
  });

  it("should verify a valid token", async () => {
    expect(await TokenIssuer.verify(validToken)).toBe(true);
  });

  it("should not verify an invalid token", async () => {
    expect(await TokenIssuer.verify(invalidToken)).toBe(false);
  });

  it("should decode a token", async () => {
    expect(await TokenIssuer.decode(validToken)).toMatchObject(payload);
  });
});
