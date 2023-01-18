import { StatusCodes } from "http-status-codes";
import { config } from "~/shared/config";
import { HttpError } from "~/shared/error/HttpError";
import { container } from "~/shared/infra/container";
import { IHash } from "~/shared/infra/container/provider/Hash/IHash";

export class Password {
  constructor(private _value: string, private readonly hashProvider: IHash = container.get("hash")) {
    if (!this.isValid()) {
      throw new HttpError("Invalid Password", StatusCodes.BAD_REQUEST);
    }
  }

  get value(): string {
    return this._value;
  }

  private isValid(): boolean {
    /**
     * At least 8 characters
     * At least one lowercase letter
     * At least one uppercase letter
     * At least one number
     * At least one special character
     */
    return !!this._value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/);
  }

  async hash(): Promise<void> {
    this._value = await this.hashProvider.generate(this._value, config.auth.passwordHashSalt);
  }

  async verify(password: string): Promise<boolean> {
    return await this.hashProvider.verify(this._value, password);
  }
}
