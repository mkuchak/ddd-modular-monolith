import { StatusCodes } from "http-status-codes";
import { HttpError } from "~/shared/error/HttpError";

export class Email {
  constructor(private _value: string) {
    if (!this.isValid()) {
      throw new HttpError("Invalid Email", StatusCodes.BAD_REQUEST);
    }
  }

  get value(): string {
    return this._value.trim();
  }

  private isValid(): boolean {
    /**
     * Allow only alphanumeric characters, plus -_.
     * Forbid the use of alias with +
     * At least one letter before the @
     * At least one letter before and after .
     */
    return !!this._value.match(/^([a-z0-9_.-])+@([\da-z.-]+)\.([a-z.]{2,6})$/i);
  }
}
