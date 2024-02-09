import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema(
  {
    // id: { type: Number, required: true },
    // name: {
    //   type: String,
    //   required: true,
    // },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const Users = new mongoose.model("Users", userSchema);

const taskSchema = new mongoose.Schema({
  // id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  created_on: {
    type: Date,
    default: Date.now,
  },
  completed_on: {
    type: Date,
  },
  priority: {
    type: String,
    default: "Normal",
  },
  status: {
    type: Number,
    default: 1,
  },
  uname: {
    type: String,
    required: true,
  },
});

export const Tasks = new mongoose.model("Tasks", taskSchema);
