import { CheckAuthentication } from "~/module/auth/application/usecase/CheckAuthentication";

export const isAuthenticated = async (context: Context) => {
  const input = { accessToken: context.headers["authorization"]?.split(" ")[1] };

  const checkAuthentication = new CheckAuthentication();
  const output = await checkAuthentication.execute(input);

  context.custom = { ...context.custom, userId: output.id };
};
