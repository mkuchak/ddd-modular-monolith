import type { Server } from "http";
import { AuthRepositoryFactoryMemory } from "~/module/auth/infra/factory/AuthRepositoryFactoryMemory";
import { AuthRouter } from "~/module/auth/infra/http/AuthRouter";
import { ExpressHttp } from "~/shared/infra/http/ExpressHttp";
// import { container } from "~/shared/infra/container";

let server: Server;
let port: number;

export const startServer = async (httpPort?: number) => {
  const http = new ExpressHttp();
  const authRepositoryFactory = new AuthRepositoryFactoryMemory();
  const authRouter = new AuthRouter(http, authRepositoryFactory);

  // choose between container or manual dependency injection
  // const http = container.get("http");
  // const authRouter = container.get("authRouter");

  authRouter.init("/api/v1");

  [server, port] = await http.listen(httpPort);

  return port;
};

export const stopServer = () => {
  server.close(() => {
    console.log("Server closed");
  });
};
