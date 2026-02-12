const JWT_SECRET = process.env.JWT_SECRET || "super-strong-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super-strong-refresh-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export default { JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN };
