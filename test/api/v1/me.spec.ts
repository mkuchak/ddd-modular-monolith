import { userDtoFactory } from "^/factory/userDtoFactory";
import axios, { type AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { IUserProps } from "~/module/auth/domain/entity/User";
import { startServer, stopServer } from "~/shared/bootstrap/expressServer";

let api: AxiosInstance;
let userDto: IUserProps;
let accessToken: string;

beforeAll(async () => {
  const port = await startServer();
  const baseURL = `http://localhost:${port}/api/v1`;

  api = axios.create({
    baseURL,
    validateStatus: () => true,
  });

  userDto = userDtoFactory();
  await api.post("/signup", userDto);
  const { data } = await api.post("/signin", userDto);
  accessToken = data.accessToken;
});

afterAll(() => {
  stopServer();
});

describe("/api/v1", () => {
  describe("GET /me", () => {
    it("should return the current user", async () => {
      const { data, status } = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(status).toBe(StatusCodes.OK);
      expect(data).toEqual({
        id: expect.any(String),
        name: userDto.name,
        email: userDto.email,
        isActive: true,
        session: expect.any(Array),
      });
    });

    it("should not return the current user with an invalid access token", async () => {
      const { data, status } = await api.get("/me", {
        headers: {
          Authorization: `Bearer invalid`,
        },
      });

      expect(status).toBe(StatusCodes.UNAUTHORIZED);
      expect(data).toEqual({
        error: "Invalid Token",
      });
    });
  });
});
