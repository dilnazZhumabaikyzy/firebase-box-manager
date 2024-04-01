/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import express from "express";
import {addEntry} from "./entryController";

const app = express();
app.get("/", (req, res) => {
  logger.info("tested successful", {structuredData: true});
  res.status(200).send("Hey there!");
});

app.post("/entries", addEntry);
exports.app = onRequest(app);

