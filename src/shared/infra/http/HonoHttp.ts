import { Hono } from "hono";
import type { Context as HonoContext, Next } from "hono";
import type { CookieOptions } from "hono/utils/cookie";
import type { StatusCode } from "hono/utils/http-status";
import { HttpError } from "~/shared/error/HttpError";
import { IHttp } from "~/shared/infra/http/IHttp";

interface IRouter extends Hono {
  [key: string]: any;
}

export class HonoHttp implements IHttp {
  private readonly router: IRouter;

  constructor() {
    this.router = new Hono();
    this.createContext(); // normalizing request arguments in a context to standardize use in controllers and middlewares

    // TODO: add CORS, rate limiting and observability
  }

  private createContext(): void {
    this.router.use("*", async (c: HonoContext, next: Next) => {
      c.req.ctx = {
        params: c.req.param(),
        query: c.req.query(),
        cookies: c.req.cookie(),
        headers: c.req.header(),
        custom: {
          ip: c.req.headers.get("cf-connecting-ip") || c.req.headers.get("x-forwarded-for"),
        },
      };

      try {
        c.req.ctx.body = await c.req.json();
      } catch {
        c.req.ctx.body = {};
      }

      await next();
    });
  }
  on(method: string, path: string, ...handlers: Function[]): void {
    const callback = handlers.pop();

    // TODO: implement a way to cache routes

    return this.router[method](
      path,
      async (c: HonoContext, next: Next) => {
        for (const handler of handlers) {
          await handler(c.req.ctx);
        }

        await next();
      },
      async (c: HonoContext): Promise<Response> => {
        const { status, json, headers = {}, cookies = {}, redirect }: Reply = await callback(c.req.ctx);

        for (const [name, cookie] of Object.entries(cookies)) {
          const { value, options } = cookie;
          if (options?.sameSite && typeof options.sameSite !== "boolean") {
            options.sameSite = options.sameSite.toLowerCase() as any;
          }
          c.cookie(name, value, options as unknown as CookieOptions);
        }

        if (redirect) {
          c.redirect(redirect);
        }

        for (const [name, value] of Object.entries(headers)) {
          c.res.headers.append(name, value);
        }

        c.status(status as StatusCode);
        return c.json(json);
      }
    );
  }

  join(...handlers: any[]): Hono {
    return this.router.use(...handlers);
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

  async start(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // middleware error handler
    this.router.onError((error: Error, c: HonoContext) => {
      if (error instanceof HttpError) {
        c.status(error.status as StatusCode);
        return c.json({ error: error.message });
      }

      console.error(error);
      c.status(500);
      return c.json({ error: "Internal Server Error" });
    });

    return await this.router.fetch(request, env, ctx);
  }
}
