interface CookiesObject {
  [key: string]: CookieEntry;
}

interface CookieEntry {
  value: string;
  options?: Options;
}

interface HeadersObject {
  [key: string]: string;
}

interface Options {
  domain?: string;
  encode?: (val: string) => string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: boolean | "lax" | "strict" | "none";
  secure?: boolean;
  signed?: boolean;
}

interface Headers {
  [key: string]: string;
}

interface Context {
  params?: any;
  query?: any;
  body?: any;
  cookies?: any;
  headers?: any;
  custom?: any;
}

interface Reply {
  status?: number;
  json?: any;
  headers?: HeadersObject;
  cookies?: CookiesObject;
  redirect?: string;
}
