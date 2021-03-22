const dotenv = require("dotenv");
const isDev = process.env.NODE_ENV.includes("dev");
const envPath = isDev ? ".env.dev" : ".env";
dotenv.config({
  path: envPath,
});
const app = require("express")();

app.get("/", (req, res) => {
  console.log(`hit the page`);
  const foo = process.env["foo"];
  res.send(foo);
});

app.listen(8080, () => {
  console.log(`server is running http://localhost:8080`);
});
