import { userDtoFactory } from "^/factory/userDtoFactory";
import axios, { type AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { IUserProps } from "~/module/auth/domain/entity/User";
import { startServer, stopServer } from "~/shared/bootstrap/expressServer";

let api: AxiosInstance;
let userDto: IUserProps;

beforeAll(async () => {
  const port = await startServer();
  const baseURL = `http://localhost:${port}/api/v1`;

  api = axios.create({
    baseURL,
    validateStatus: () => true,
  });

  userDto = userDtoFactory();
  await api.post("/signup", userDto);
});

afterAll(() => {
  stopServer();
});

describe("/api/v1", () => {
  describe("POST /signin", () => {
    it("should sign in a user", async () => {
      const { data, status } = await api.post("/signin", userDto);

      expect(status).toBe(StatusCodes.OK);
      expect(data).toEqual({
        refreshToken: expect.any(String),
        accessToken: expect.any(String),
      });
    });

    it("should not sign in a user with an invalid email", async () => {
      const { data, status } = await api.post("/signin", {
        ...userDto,
        email: "invalid",
      });

      expect(status).toBe(StatusCodes.UNAUTHORIZED);
      expect(data).toEqual({
        error: "Invalid Credentials",
      });
    });

    it("should not sign in a user with an invalid password", async () => {
      const { data, status } = await api.post("/signin", {
        ...userDto,
        password: "invalid",
      });

      expect(status).toBe(StatusCodes.UNAUTHORIZED);
      expect(data).toEqual({
        error: "Invalid Credentials",
      });
    });
  });
});
