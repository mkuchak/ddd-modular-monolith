import { userDtoFactory } from "^/factory/userDtoFactory";
import axios, { type AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { startServer, stopServer } from "~/shared/bootstrap/expressServer";

let api: AxiosInstance;

beforeAll(async () => {
  const port = await startServer();
  const baseURL = `http://localhost:${port}/api/v1`;

  api = axios.create({
    baseURL,
    validateStatus: () => true,
  });
});

afterAll(() => {
  stopServer();
});

describe("/api/v1", () => {
  describe("POST /signup", () => {
    it("should create a new user account", async () => {
      const userDto = userDtoFactory();
      const { data, status } = await api.post("/signup", userDto);

      expect(status).toBe(StatusCodes.CREATED);
      expect(data).toEqual({
        id: expect.any(String),
        email: userDto.email,
        name: userDto.name,
      });
    });

    it("should not create a new user account with an existing email", async () => {
      const userDto = userDtoFactory();
      await api.post("/signup", userDto);
      const { data, status } = await api.post("/signup", userDto);

      expect(status).toBe(StatusCodes.CONFLICT);
      expect(data).toEqual({
        error: "Email Already Exists",
      });
    });

    it("should not create a new user account with an invalid email", async () => {
      const userDto = userDtoFactory({ email: "invalid" });
      const { data, status } = await api.post("/signup", userDto);

      expect(status).toBe(StatusCodes.BAD_REQUEST);
      expect(data).toEqual({
        error: "Invalid Email",
      });
    });

    it("should not create a new user account with an invalid password", async () => {
      const userDto = userDtoFactory({ password: "invalid" });
      const { data, status } = await api.post("/signup", userDto);

      expect(status).toBe(StatusCodes.BAD_REQUEST);
      expect(data).toEqual({
        error: "Invalid Password",
      });
    });
  });
});
