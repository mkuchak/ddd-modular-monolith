import "express-async-errors";

import getPort from "get-port";
import express from "express";
import type { CookieOptions, Express, NextFunction, Request, Response } from "express";
import type { Server } from "http";
import requestIp from "request-ip";
import { HttpError } from "~/shared/error/HttpError";
import { IHttp } from "~/shared/infra/http/IHttp";

interface IRouter extends Express {
  [key: string]: any;
}

export class ExpressHttp implements IHttp {
  private readonly router: IRouter;

  constructor() {
    this.router = express();
    this.router.use(express.json());
    this.router.use(requestIp.mw());
    this.createContext(); // normalizing request arguments in a context to standardize use in controllers and middlewares

    // TODO: add CORS, rate limiting and observability
  }

  private createContext(): void {
    this.router.use("*", async (request: Request, _response: Response, next: NextFunction) => {
      request.ctx = {
        params: request.params,
        query: request.query,
        body: request.body,
        cookies: request.cookies,
        headers: request.headers,
        custom: {
          ip: request.clientIp,
        },
      };

      next();
    });
  }

  on(method: string, path: string, ...handlers: Function[]): void {
    const callback = handlers.pop();

    // TODO: implement a way to cache routes

    return this.router[method](
      path,
      async (request: Request, _response: Response, next: NextFunction) => {
        for (const handler of handlers) {
          await handler(request.ctx);
        }

        next();
      },
      async (request: Request, response: Response): Promise<Response> => {
        const { status, json, headers = {}, cookies = {}, redirect }: Reply = await callback(request.ctx);

        for (const [name, cookie] of Object.entries(cookies)) {
          const { value, options } = cookie;
          response.cookie(name, value, options as CookieOptions);
        }

        if (redirect) {
          response.redirect(redirect);
        }

        response.set(headers);

        return response.status(status || 200).json(json);
      }
    );
  }

  join(...handlers: any[]): void {
    this.router.use(...handlers);
  }

  group(prefix = "", callback: (http: Partial<IHttp>) => void) {
    callback({
      join: (...handlers: any[]) => {
        this.join(prefix, ...handlers);
      },
      on: (method: string, path: string, ...handlers: any[]) => {
        this.on(method, prefix + path, ...handlers);
      },
    });
  }

  async listen(port?: number): Promise<[Server, number]> {
    // error handler must be the last middleware to be registered on express
    this.router.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
      if (error instanceof HttpError) {
        return response.status(error.status).json({ error: error.message });
      }

      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
    });

    port = port || (await getPort());
    const server = this.router.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    return [server, port];
  }
}
