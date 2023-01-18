import { faker } from "@faker-js/faker";
import { container } from "~/shared/infra/container";

const date = container.get("date");

interface SessionDtoFactory {
  lastIp?: string;
  userAgent?: string;
  expiresAt?: Date;
}

export const sessionDtoFactory = ({ lastIp, userAgent, expiresAt }: SessionDtoFactory = {}) => ({
  lastIp: lastIp ?? faker.internet.ip(),
  userAgent: userAgent ?? faker.internet.userAgent(),
  expiresAt: expiresAt ?? date.addDays(new Date(), 1),
});
