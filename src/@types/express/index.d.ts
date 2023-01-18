interface Request {
  ctx?: Context;
}

declare namespace Express {
  export interface Request {
    ctx?: Context;
  }
}

declare module "express-async-errors" {}
