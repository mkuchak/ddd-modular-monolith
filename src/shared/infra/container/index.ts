import { createContainer } from "iti";
import { SignIn } from "~/module/auth/application/usecase/SignIn";
import { SignUp } from "~/module/auth/application/usecase/SignUp";
import { AuthController } from "~/module/auth/infra/controller/AuthController";
import { AuthRepositoryFactoryMemory } from "~/module/auth/infra/factory/AuthRepositoryFactoryMemory";
import { AuthRouter } from "~/module/auth/infra/http/AuthRouter";
import { DateFns } from "~/shared/infra/container/provider/Date/implementation/DateFns";
import { Argon2 } from "~/shared/infra/container/provider/Hash/implementation/Argon2";
import { JsonWebToken } from "~/shared/infra/container/provider/Jwt/implementation/JsonWebToken";
import { ExpressHttp } from "~/shared/infra/http/ExpressHttp";

export const container = createContainer()
  .add({
    date: () => new DateFns(),
    hash: () => new Argon2(),
    // hash: () => new BcryptJs(),
    jwt: () => new JsonWebToken(),
    // jwt: () => new CloudflareWorkerJwt(),
  })
  .add({
    http: () => new ExpressHttp(),
    // http: () => new HonoHttp(),
  })
  .add({
    authRepositoryFactory: () => new AuthRepositoryFactoryMemory(),
  })
  .add((c) => ({
    authRouter: () => new AuthRouter(c.http, c.authRepositoryFactory),
  }))
  .add((c) => ({
    authController: () => new AuthController(c.authRepositoryFactory),
  }))
  .add((c) => ({
    signIn: () => new SignIn(c.authRepositoryFactory),
    signUp: () => new SignUp(c.authRepositoryFactory),
  }));
