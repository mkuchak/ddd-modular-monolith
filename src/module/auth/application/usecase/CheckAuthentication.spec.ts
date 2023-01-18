import { faker } from "@faker-js/faker";
import { CheckAuthentication } from "~/module/auth/application/usecase/CheckAuthentication";
import { TokenIssuer } from "~/module/auth/domain/service/TokenIssuer";

let checkAuthentication: CheckAuthentication;
let validToken: string;
let invalidToken: string;
const payload = { id: faker.datatype.uuid() };

beforeEach(async () => {
  checkAuthentication = new CheckAuthentication();
  validToken = await TokenIssuer.issue(payload);
  invalidToken = await TokenIssuer.issue(payload, -1);
});

describe("CheckAuthentication", () => {
  it("should check authentication", async () => {
    const output = await checkAuthentication.execute({ accessToken: validToken });

    expect(output).toEqual({
      id: payload.id,
    });
  });

  it("should not check authentication with an invalid token", async () => {
    await expect(checkAuthentication.execute({ accessToken: invalidToken })).rejects.toThrow("Invalid Token");
  });
});
