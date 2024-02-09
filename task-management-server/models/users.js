import { Users } from "./model.js";

export const createUser = async (user) => {
  try {
    const newUser = new Users({
      name: user.name,
      username: user.uname,
      password: user.password,
    });

    await newUser.save();
    // const verdict = await newUser.save();
    // console.log(verdict);
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (uname) => {
  try {
    const user = await Users.find({ username: uname });
    return user;
  } catch (err) {
    console.log(err);
  }
};
