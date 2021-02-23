import express, { ErrorRequestHandler } from "express";
import session from "express-session";
import redis from "redis";
import redisConnect from "connect-redis";
import cors, { CorsOptions } from "cors";
import { json as jsonParser } from "body-parser";
import { authRouter } from "./router/auth.router";
import { errorHandler } from "./error";

const RedisStore = redisConnect(session);
const redisClient = redis.createClient();
const app = express();

const corsOptions: CorsOptions = {
  credentials: true,
  origin: `http://localhost:1234`,
};
app.use(cors(corsOptions));
app.use(
  session({
    secret: `secret`,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: new RedisStore({
      host: "localhost",
      port: 6379,
      client: redisClient,
      ttl: 86400,
    }),
  })
);
app.use(jsonParser());
app.use("/auth", authRouter);
app.use(errorHandler);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
