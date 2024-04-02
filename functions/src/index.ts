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
  getAllReports,
  getReports,
} from "./reportController";

const app = express();

app.get("/", (req, res) => {
  logger.info("tested successful", {structuredData: true});
  res.status(200).send("Hey there!");
});

app.post("/boxes", addBox);
app.get("/boxes", getAllBoxes);
app.patch("/boxes/:entryId", updateBox);
app.delete("/boxes/:entryId", deleteBox);

app.post("/reports", addReport);
app.get("/reports/all", getAllReports);
app.delete("/reports/:entryId", deleteReport);
app.get("/reports", getReports);

exports.app = onRequest(app);
