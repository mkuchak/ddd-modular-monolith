import { IAuthRepositoryFactory } from "~/module/auth/domain/factory/IAuthRepositoryFactory";
import { AuthController } from "~/module/auth/infra/controller/AuthController";
import { container } from "~/shared/infra/container";
import { IHttp } from "~/shared/infra/http/IHttp";
import { isAuthenticated } from "~/shared/infra/http/middleware/isAuthenticated";

export class AuthRouter {
  authController: AuthController;

  constructor(
    private readonly http: IHttp,
    private readonly authRepositoryFactory: IAuthRepositoryFactory = container.get("authRepositoryFactory")
  ) {
    this.authController = new AuthController(this.authRepositoryFactory);
  }

  init(prefix = ""): void {
    this.http.group(prefix, (http) => {
      http.on("post", "/signup", (context: Context) => this.authController.signUp(context));
      http.on("post", "/signin", (context: Context) => this.authController.signIn(context));
      http.on("get", "/me", isAuthenticated, (context: Context) => this.authController.me(context));
    });
  }
}
