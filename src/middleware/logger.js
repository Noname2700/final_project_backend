import { format as _format, transports as _transports } from "winston";
import { logger, errorLogger as _errorLogger } from "express-winston";

const messageFormat = _format.combine(
  _format.timestamp(),
  _format.printf(({ level, message, meta, timestamp }) => {
    return `${timestamp} [${level}]: ${message} ${meta?.error?.stack || message}`;
  }),
);

const requestLogger = logger({
  transports: [
    new _transports.Console({ format: messageFormat }),
    new _transports.File({
      filename: "logs/requests.log",
      format: _format.json(),
    }),
  ],
});

const errorLogger = _errorLogger({
  transports: [
    new _transports.File({
      filename: "logs/errors.log",
      format: _format.json(),
    }),
  ],
});

export default {
  requestLogger,
  errorLogger,
};
