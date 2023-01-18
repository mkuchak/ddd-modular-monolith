import { StatusCodes } from "http-status-codes";
import { TokenIssuer } from "~/module/auth/domain/service/TokenIssuer";
import { HttpError } from "~/shared/error/HttpError";

export const isAuthenticated = async (context: Context) => {
  const accessToken = context.headers["authorization"]?.split(" ")[1];

  const isValid = await TokenIssuer.verify(accessToken);

  if (!isValid) {
    throw new HttpError("Invalid Token", StatusCodes.UNAUTHORIZED);
  }

  const { id } = await TokenIssuer.decode(accessToken);

  context.custom = { ...context.custom, userId: id };
};
