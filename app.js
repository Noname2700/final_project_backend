import express, { json } from "express";
import { readFileSync } from "fs";
import { createServer } from "https";
import { connect } from "mongoose";
import { config } from "dotenv";
import morgan from "morgan";
import logger from "./src/middleware/logger.js";
import cors from "cors";
import errorHandler from "./src/middleware/error-handler.js";
import articleItemsRouter from "./src/routes/articleItems.js";
import usersRouter from "./src/routes/users.js";
import helmet from "helmet";
import apiLimiter from "./src/middleware/rateLimiter.js";
import usersController from "./src/controllers/users.js";
import validation from "./src/middleware/validation.js";

config();

const app = express();

app.use(helmet());

app.use(apiLimiter);

// --- HTTPS server creation is commented out for local development to avoid certificate issues ---
// const sslOptions = {
//   key: readFileSync("server.key"),
//   cert: readFileSync("server.cert"),
// };
// const { PORT = 3002 } = process.env;
// createServer(sslOptions, app).listen(PORT, () => {
//   console.log(`HTTPS Server running on https://localhost:${PORT}`);
// });

// Use HTTP for local development
const { PORT = 3002 } = process.env;
app.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
});

connect("mongodb://localhost:27017/news-db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

const morganStream = {
  write: (message) => {
    console.log(message.trim());
  },
};

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the News API" });
});

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("The server will crash now");
  }, 0);
});

app.use(morgan("combined", { stream: morganStream }));
app.use(logger.requestLogger);
app.use(logger.errorLogger);
app.use(errorHandler);

app.use("/api/articles", articleItemsRouter);
app.use("/api/users", usersRouter);

/*app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});*/
