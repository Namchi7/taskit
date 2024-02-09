import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET = process.env.SECRET_JWT_KEY;

export const setUserAuth = (user) => {
  console.log();
  const token = jwt.sign(
    {
      _id: user._id,
      uname: user.username,
    },
    SECRET
  );
  return token;
};

export const getUserAuth = (token) => {
  if (!token) return null;
  try {
    const dcd = jwt.verify(token, SECRET);

    return dcd;
  } catch (error) {
    return null;
  }
};
