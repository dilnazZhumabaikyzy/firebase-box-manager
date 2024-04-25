import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import express from "express";
import {
  addBox,
  getAllBoxes,
  updateBox,
  deleteBox,
} from "./boxController";
import {
  addReport,
  deleteReport,
  getReportsOfBox,
  getLastReports,
} from "./reportController";
import {onUpdateReceived} from "./telegramBotController";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserById,
} from "./userController";

const app = express();

app.get("/", (req, res) => {
  logger.info("tested successful", {structuredData: true});
  res.status(200).send("Hey there!");
});

app.post("/boxes", addBox);
app.get("/boxes", getAllBoxes);
app.patch("/boxes/:entryId", updateBox);
app.delete("/boxes/:entryId", deleteBox);

app.post("/boxes/:boxId/reports", addReport);
app.get("/reports", getLastReports);
app.get("/reports/all", getReportsOfBox);
app.delete("/reports/:entryId", deleteReport);

app.post("/telegram", onUpdateReceived);

app.get("/users", getUsers);
app.post("/users", addUser);
app.get("/users/:username", getUserById);
app.patch("/users/:username", updateUser);
app.delete("/users/:username", deleteUser);

exports.app = onRequest(app);
