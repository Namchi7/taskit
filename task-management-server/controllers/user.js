import bcrypt from "bcryptjs";

import { getUser, createUser } from "../models/users.js";
import { setUserAuth, getUserAuth } from "../services/auth.js";

export const handleUserSignUp = async (req, res, next) => {
  const { uname, password } = req.query;
  const user = await getUser(uname);

  if (user?.length !== 0) {
    console.log("User already exists.");
    res.json({ msg: "User already exists.", success: false });
  } else {
    createUser({
      // name,
      uname,
      password,
    });

    next();
  }
};

export const handleUserLogin = async (req, res, next) => {
  const { uname, password } = req.query;
  const user = await getUser(uname);

  if (user?.length === 0) {
    res.json({ error: "User not found", loggedIn: false });
    // return res.redirect("/login-failed");
  } else {
    bcrypt.compare(password, user[0]?.password, (err, result) => {
      if (err) {
        console.log(err, "error aa gya");
        res.json({ error: "Server error", loggedIn: false });
      } else if (result) {
        const token = setUserAuth(user[0]);
        res.cookie("jwt", token, { path: "/", sameSite: "lax", secure: true });
        next();
      } else {
        console.log("pass nhi match ho rha");
        res.json({ error: "Password does not match", loggedIn: false });
      }
    });
  }
};

export const checkUserLogin = async (req, res, next) => {
  if (!req.headers.cookie) return res.json({ loggedIn: false, uname: null });

  const cookieString = req.headers.cookie.split("=");

  const token = cookieString[1];
  const dcd = getUserAuth(token);

  if (dcd === null) return res.json({ loggedIn: false, uname: null });
  if (!dcd?.uname) return res.json({ loggedIn: false, uname: null });

  const user = await getUser(dcd?.uname);
  if (user.length === 0) return res.json({ loggedIn: false, uname: null });

  req.username = user[0].username;

  next();
};
