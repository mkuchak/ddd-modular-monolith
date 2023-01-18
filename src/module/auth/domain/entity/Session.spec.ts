import { sessionDtoFactory } from "^/factory/sessionDtoFactory";
import { Session } from "~/module/auth/domain/entity/Session";
import { container } from "~/shared/infra/container";

const date = container.get("date");

describe("Session", () => {
  it("should create a new session", async () => {
    const sessionDto = sessionDtoFactory();
    const session = new Session(sessionDto);

    expect(session).toMatchObject(sessionDto);
  });

  it("should check if a not expired session is expired", () => {
    const session = new Session(sessionDtoFactory());

    expect(session.isExpired()).toBe(false);
  });

  it("should check if a expired session is expired", () => {
    const session = new Session(
      sessionDtoFactory({
        expiresAt: date.addDays(new Date(), -7),
      })
    );

    expect(session.isExpired()).toBe(true);
  });

  it("should check if a session without expiration date is expired", () => {
    const session = new Session(sessionDtoFactory({ expiresAt: undefined }));

    expect(session.isExpired()).toBe(false);
  });

  it("should check if a session with an invalid expiration date is expired", () => {
    const session = new Session(sessionDtoFactory({ expiresAt: new Date("invalid") }));

    expect(session.isExpired()).toBe(false);
  });

  it("should refresh a session", () => {
    const session = new Session(sessionDtoFactory());
    const oldSession = structuredClone(session);

    session.refresh();

    expect(session.value).not.toEqual(oldSession.value);
    expect(session.expiresAt).toEqual(oldSession.expiresAt);
  });

  it("should refresh a session with a new expiration date", () => {
    const session = new Session(sessionDtoFactory());
    const oldSession = structuredClone(session);

    session.refresh(date.addDays(new Date(), 7));

    expect(session.value).not.toEqual(oldSession.value);
    expect(session.expiresAt).not.toEqual(oldSession.expiresAt);
  });
});
