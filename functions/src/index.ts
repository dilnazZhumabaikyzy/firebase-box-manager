import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import express from "express";
import {addBox, deleteBox, getAllBoxes, updateBox} from "./boxController";
import {addReport,
  getLastReportsController,
  getReportsOfBox} from "./reportController";
import {onUpdateReceived} from "./telegramBotController";
import {addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser} from "./userController";
import {login, logout, refresh, register} from "./authenticationController";
import cookieParser from "cookie-parser";
import authMiddleware from "./middleware/auth-middleware";
import {body} from "express-validator";

const app = express();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require("cors");

app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  logger.info("tested successful", {structuredData: true});
  res.status(200).send("Hey there!");
});

app.post("/boxes", authMiddleware, addBox);
app.get("/boxes", authMiddleware, getAllBoxes);
app.patch("/boxes/:entryId", authMiddleware, updateBox);
app.delete("/boxes/:entryId", authMiddleware, deleteBox);
app.post("/boxes/:boxId/reports", addReport);

app.get("/reports", getLastReportsController);
app.get("/reports/all", getReportsOfBox);
app.get("/reports/:boxId", getReportsOfBox);


app.post("/telegram", onUpdateReceived);

app.post("/auth/register",
  body("phoneNumber").isMobilePhone("kk-KZ"),
  body("password").isLength({min: 6, max: 32}),
  register);

app.post("/auth/login", login);
app.post("/auth/logout", logout);
app.post("/auth/refresh", refresh);

app.get("/users", authMiddleware, getUsers);
app.post("/users", authMiddleware, addUser);
app.get("/users/:phoneNumber", authMiddleware, getUserById);
app.patch("/users/:phoneNumber", authMiddleware, updateUser);
app.delete("/users/:phoneNumber", authMiddleware, deleteUser);

exports.app = onRequest(app);
