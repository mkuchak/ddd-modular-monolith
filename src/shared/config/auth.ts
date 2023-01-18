export const auth = {
  passwordHashSalt: Number(process.env.PASSWORD_HASH_SALT) || 6,
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtExpiration: Number(process.env.JWT_EXPIRATION) || 15, // in minutes
  refreshTokenExpiration: Number(process.env.REFRESH_TOKEN_EXPIRATION) || 90, // in days
  renewRefreshTokenExpiration: Boolean(process.env.RENEW_REFRESH_TOKEN_EXPIRATION) || true,
  // passwordHashSalt: 6,
  // jwtSecret: "secret",
  // jwtExpiration: 15, // in minutes
  // refreshTokenExpiration: 90, // in days
  // renewRefreshTokenExpiration: true,
};
