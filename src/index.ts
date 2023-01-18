import { startServer } from "~/shared/bootstrap/expressServer";
import { config } from "~/shared/config";

startServer(config.server.port);

// export default {
//   async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
//     const http = new HonoHttp();
//     const authRepositoryFactory = new AuthRepositoryFactoryMemory();
//     const authRouter = new AuthRouter(http, authRepositoryFactory);

//     authRouter.init("/api/v1");

//     return http.start(request, env, ctx);
//   },
// };
