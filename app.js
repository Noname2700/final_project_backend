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

const { PORT = 3002, MONGODB_URI = "mongodb://localhost:27017/news-db" } =
  process.env;

mongoose
  .connect(MONGODB_URI)
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
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:3000", "https://newsarticles.chickenkiller.com"];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
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
