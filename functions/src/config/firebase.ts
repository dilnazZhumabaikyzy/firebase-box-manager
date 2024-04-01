import * as admin from "firebase-admin";
import serviceAccount from "./admin.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

const entry = db.collection("entries").doc();

const entryObject = {
  id: entry.id,
  title: "entry title here",
  text: "entry text here",
};

entry.set(entryObject);

export {admin, db};
