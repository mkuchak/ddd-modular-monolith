import { Email } from "~/module/auth/domain/entity/Email";

// prettier-ignore
const validEmails = ["johndoe@example.com", "john_doe@example.com", "john.doe@example.com", "john-doe@example.com", "johndoe@provider.com.br", "jd@ex.co"];
// prettier-ignore
const invalidEmails = ["johndoe+1@example.com", "johndoe@examplecom", "johndoeexample.com", "johndoeexamplecom", "johndoe@", "@example.com", "@.com"];

describe("Email", () => {
  it("should validate an email address", () => {
    validEmails.forEach((email) => {
      expect(new Email(email).value).toBe(email);
    });
  });

  it("should not validate an email address", () => {
    invalidEmails.forEach((email) => {
      expect(() => new Email(email)).toThrowError("Invalid Email");
    });
  });
});
