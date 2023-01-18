import { Password } from "~/module/auth/domain/entity/Password";

// prettier-ignore
const validPasswords = ['12345@Aa', 'Abcd1@#$', 'abcD~1234', 'abcD!1234', 'abcD1#234', 'abcD12$34', 'abcD123%4', 'abcD1234^', 'abcD&1234', 'abc*D1234', 'ab(cD1234', 'a)bcD1234', '-abcD1234', 'abcD=1234', 'abc1D+234', 'abc.1D234', 'ab4cD;123', 'bcD,12a34', '12345 @Aa']
// prettier-ignore
const invalidPasswords = ['1234567', '12345Aa', '1234@Aa', '12345@AA', '12345@aa', '!@#$%^&*', 'Abcd1234', 'Abcd!@#$', '123!@#$%^&*', '123!@#$%^&*A', '123!@#$%^&*a', 'password', 'PASSWORD', 'PASSWORD123', 'passworD', '1password2', '1pass@word2', 'p4ssword', 'P@SSWORD']

describe("Password", () => {
  it("should validate a password", () => {
    validPasswords.forEach((password) => {
      expect(new Password(password).value).toBe(password);
    });
  });

  it("should not validate a password", () => {
    invalidPasswords.forEach((password) => {
      expect(() => new Password(password)).toThrowError("Invalid Password");
    });
  });

  it("should hash a password", async () => {
    const password = new Password(validPasswords[0]);
    await password.hash();

    expect(password.value).not.toBe(validPasswords[0]);
  });

  it("should compare a password", async () => {
    const password = new Password(validPasswords[0]);
    await password.hash();

    expect(await password.verify(validPasswords[0])).toBe(true);
  });
});
