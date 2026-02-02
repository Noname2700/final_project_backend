import express, { json } from "express";
import cookieParser from "cookie-parser";
import mongoose, { connect } from "mongoose";
import { config } from "dotenv";
import morgan from "morgan";
import logger from "./src/middleware/logger.js";
import cors from "cors";
import errorHandler from "./src/middleware/error-handler.js";
import articleItemsRouter from "./src/routes/articleItems.js";
import usersRouter from "./src/routes/users.js";
import helmet from "helmet";
import apiLimiter from "./src/middleware/rateLimiter.js";

config();

const app = express();

app.use(helmet());

app.use(apiLimiter);

const { PORT = 3002 } = process.env;

mongoose
  .connect("mongodb://localhost:27017/news-db")
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
  origin: process.env.CORS_ORIGIN || "https://newsarticles.chickenkiller.com",
  optionsSuccessStatus: 200,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
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

app.use("/api/articles", articleItemsRouter);
app.use("/api/users", usersRouter);

app.use(logger.errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
});
