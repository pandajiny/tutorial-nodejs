import express from "express";
import { sampleUsers } from "../constants";
import { HttpError, UnauthorizedError } from "../error";

export const router = express.Router();

router.get("/user/:user", (req, res) => {
  res.send(`hello ${req.params.user}`);
});

router.get("/login", (req, res) => {});

router.post("/login", (req, res) => {
  console.log(req.sessionID);
  console.log(req.headers.cookie);
  if (req.session.user_id) {
    throw new HttpError(400, "Already logged in");
  }

  const { id, password } = req.body;
  const user = sampleUsers.find((user) => user.id == id);

  if (!user) {
    throw new UnauthorizedError(`User not found`);
  }

  if (user.password == password) {
    req.session.user_id = id;
    res.json({
      sessionId: req.session.id,
    });
  } else {
    throw new UnauthorizedError(`Password invalid`);
  }
});
// router.get("/login/:user", (req, res) => {
//   if (!req.session.user) {
//     const user = req.params.user;
//     req.session.user = user;
//     res.send(`login as ${user}`);
//   } else {
//     const user = req.session.user;
//     res.redirect(`/auth/user/${user}`);
//   }
// });

router.get("/logout", (req, res) => {
  if (!req.session.user) {
    res.send("please login first");
  } else {
    const user = req.session.user;
    req.session.user = undefined;
    res.send(`logout done goodbye ${user}`);
  }
});

export const authRouter = router;
