const express = require("express");
const app = express();

app.get("/", function handler(req, res) {
  console.log(`hit the path : /`);
  res.send("default path");
});

app.get("/hello", function handler(req, res) {
  console.log(`git the path : /hello`);
  res.send("hello?");
});

app.get("/hi", async () => {
  throw "gi";
});

app.listen(3000, function callback() {
  console.log(`Server is running on http://localhost:3000`);
});
