const express = require("express");
const fs = require("fs");
const https = require("https");
const mongoose = require("mongoose");
const { config } = require("dotenv");
const morgan = require("morgan");
const logger = require("./src/middlewares/logger");
const winston = require("winston");
const cors = require("cors");
const errorHandler = require("./src/middlewares/error-handler");
const articleItemsRouter = require("./src/routes/articleItems");
const usersRouter = require("./src/routes/users");
const helmet = require("helmet");
const apiLimiter = require("./src/middlewares/rateLimiter");

config();

const app = express();

app.use(helmet());

app.use(apiLimiter);

const sslOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const { PORT = 3001 } = process.env;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});

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
    winston.info(message.trim());
  },
};

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

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
