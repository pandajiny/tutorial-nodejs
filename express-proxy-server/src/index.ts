import http from "http";
import https from "https";
import fs from "fs";
import express, { RequestHandler, response } from "express";
import session from "express-session";
import { createProxyMiddleware } from "http-proxy-middleware";
import axios from "axios";
import {
  AUTH_SERVICE_URL,
  CERT_PATH,
  HTTPS_PORT,
  HTTP_PORT,
  KEY_PATH,
  SCHEDULER_URL,
} from "./constants";
import cors from "cors";
const authProxy = createProxyMiddleware({
  //   4000 : auth-service
  target: {
    protocol: "",
    host: "localhost",
    port: 4000,
  },
  changeOrigin: true,
  pathRewrite: (path) => path.replace("/auth", ""),

  // onProxyRes: (proxyRes, req, res) => {
  //   // console.log(proxyRes.headers);
  //   // console.log(proxyRes);
  //   // res.setHeader("set-cookie", proxyRes.headers["set-cookie"] as string[]);
  //   console.log(req.sessionID);
  //   console.log(proxyRes.headers);
  //   // console.log(proxyRes.);
  //   // res.setHeader("set-cookie", proxyRes.headers["set-cookie"] || "");
  //   // res.sendStatus(500);
  // },
});

// 5000 : scheduler
const schedulerProxy = createProxyMiddleware({
  target: {
    protocol: "",
    host: "scheduler-service",
    port: 4000,
  },
  pathRewrite: (path) => path.replace("/auth", ""),
  changeOrigin: true,
});

// async function checkServices() {
//   await Promise.all([
//     axios(AUTH_SERVICE_URL).catch(() => {
//       throw `auth-service not running`;
//     }),
//   ]);
// }

function isFileExists(paths: string[]): boolean {
  return paths.every((path) => fs.existsSync(path));
}

async function bootstrap() {
  const app = express();
  app.use(logMiddleware);

  // app.use(
  //   cors({
  //     credentials: true,
  //     origin: "http://localhost:1234",
  //   })
  // );

  // app.use(
  //   session({
  //     secret: "secret",
  //     cookie: {
  //       secure: true,
  //       sameSite: "none",
  //     },
  //   })
  // );

  // app.get("/", async (req, res) => {
  //   await checkServices().catch((err) => {
  //     res.status(500).send(err);
  //   });
  //   res.send("services are running");
  // });

  app.use("/auth", authProxy);
  app.use("/scheduler", schedulerProxy);

  if (isFileExists([KEY_PATH, CERT_PATH])) {
    const credentials: https.ServerOptions = {
      key: fs.readFileSync(KEY_PATH),
      cert: fs.readFileSync(CERT_PATH),
    };
    const httpServer = https.createServer(credentials, app);
    httpServer.listen(HTTPS_PORT);
    console.log(`run https server on ${HTTPS_PORT}`);
  } else {
    const httpServer = http.createServer(app);
    httpServer.listen(HTTP_PORT);
    console.log(`run https server on ${HTTP_PORT}`);
  }
}

const logMiddleware: RequestHandler = (req, res, next) => {
  const date = new Date();
  const dateString = `${date.getFullYear()} ${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  console.log(`[${dateString}] ${req.method} ${req.path}`);
  next();
};

bootstrap();
