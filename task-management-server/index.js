import express from "express";
import "dotenv/config";
import cors from "cors";

import {
  changeTaskStatus,
  createTask,
  deleteTask,
  editTask,
  getAllTasks,
} from "./models/tasks.js";
import {
  checkUserLogin,
  handleUserLogin,
  handleUserSignUp,
} from "./controllers/user.js";

const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN_URL = process.env.CORS_ORIGIN_URL;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const corsOptions = {
  origin: CORS_ORIGIN_URL,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("/", cors(corsOptions));

app.get("/all-tasks", checkUserLogin, async (req, res) => {
  const uname = req.username;
  const tasks = await getAllTasks(uname);
  res.send(tasks);
});

app.post("/create-task", checkUserLogin, async (req, res) => {
  const uname = req.username;
  const { title, description, priority, status } = req.query;
  const taskInfo = {
    title: title,
    description: description,
    created_on: new Date(),
    priority: priority.toLocaleLowerCase(),
    status: status,
    uname: uname,
  };

  const result = await createTask(taskInfo);
  res.send(result);
});

app.patch("/edit-task", checkUserLogin, async (req, res) => {
  const { taskId, title, description, priority, status } = req.query;
  const taskInfo = {
    _id: taskId,
    title: title,
    description: description,
    priority: priority,
    status: status,
  };

  const result = await editTask(taskInfo);
  res.send(result);
});

app.patch("/edit-task-status", checkUserLogin, async (req, res) => {
  const { taskId, status } = req.query;

  const task = {
    _id: taskId,
    status: status,
  };

  const result = await changeTaskStatus(task);
  res.send(result);
});

app.delete("/delete-task", checkUserLogin, async (req, res) => {
  const { taskId } = req.query;

  const result = await deleteTask(taskId);
  res.send(result);
});

// app.get("/search-task", checkUserLogin, (req, res) => {
//   const { keyword } = req.query;
//   console.log(req.username, keyword);
//   res.send("Searching");
// });

app.get("/check-jwt-token", checkUserLogin, (req, res) => {
  const uname = req.username;
  res.json({ loggedIn: true, uname: uname });
});

app.get("/login", handleUserLogin, (req, res) => {
  res.json({ msg: "LoggedIn", loggedIn: true });
});

app.get("/signup", handleUserSignUp, (req, res) => {
  res.send({ msg: "Created User", success: true });
});

app.get("/logout", checkUserLogin, (req, res) => {
  req.username = null;
  res.cookie("jwt", "", { path: "/", sameSite: "none", secure: true });
  res.json({ loggedOut: true });
});

app.get("*", (req, res) => {
  res.status(404).send("404 - Page Not Found!");
});

app.listen(PORT, () => console.log(`Listening at PORT: ${PORT}`));
