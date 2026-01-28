class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = "UnAuthorizedError";
  }
}

export default UnAuthorizedError;
