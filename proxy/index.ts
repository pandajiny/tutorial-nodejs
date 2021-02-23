import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import session from "express-session";

const proxyServer = express();
const originProxy = createProxyMiddleware({
  target: "http://localhost:5002",
});
proxyServer.use("/auth", originProxy);
proxyServer.listen(5001, () => {
  console.log(`second server is listening on 5001`);
});

const originServer = express();
originServer.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 600000,
    },
    saveUninitialized: true,
    resave: false,
  })
);
originServer.use((req, res) => {
  console.log(req.session.id);
  if (req.session.view) {
    req.session.view++;
  } else {
    req.session.view = 1;
  }
  res.send(`view : ${req.session.view}`);
});
originServer.listen(5002, () => {
  console.log(`second server is listening on 5002`);
});
