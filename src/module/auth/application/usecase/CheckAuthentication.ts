import { StatusCodes } from "http-status-codes";
import { TokenIssuer } from "~/module/auth/domain/service/TokenIssuer";
import { HttpError } from "~/shared/error/HttpError";

export interface ICheckAuthenticationInput {
  accessToken: string;
}

export interface ICheckAuthenticationOutput {
  id: string;
}

export class CheckAuthentication {
  async execute(input: ICheckAuthenticationInput): Promise<ICheckAuthenticationOutput> {
    const isValidToken = await TokenIssuer.verify(input.accessToken);

    if (!isValidToken) {
      throw new HttpError("Invalid Token", StatusCodes.UNAUTHORIZED);
    }

    const { id } = await TokenIssuer.decode(input.accessToken);

    return {
      id,
    };
  }
}
