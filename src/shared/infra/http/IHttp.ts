import { Server } from "http";

export interface IHttp {
  on(method: string, path: string, ...handlers: Function[]): void;
  join(...handlers: any[]): void;
  group(prefix: string, callback: (http: Partial<IHttp>) => void): void;
  start?(request: Request, env: Env, ctx: ExecutionContext): Promise<Response>;
  listen?(port?: number): Promise<[Server, number]>;
}
