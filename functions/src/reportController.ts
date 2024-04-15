import {Response} from "express";
import {db} from "./config/firebase";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import {logger} from "firebase-functions";
import ReportModel from "./model/modelReport";
import ReportRequest from "./request/ReportRequest";
import ReportDto from "./dto/reportDto";

const addReport = async (req: ReportRequest, res: Response) => {
  const {
    name,
    fullness,
    battery,
    network,
  } = req.body;

  if (!name || !fullness || !battery || !network) {
    return res.status(404).json({
      status: "error",
      message: "Bad ReportRequest",
    });
  }

  try {
    const entry = db.collection("reports").doc();
    const boxQuerySnapshot = await db.collection("boxes")
      .where("name", "==", name).get();

    if (boxQuerySnapshot.empty) {
      return res.status(404).json({
        status: "error",
        message: "Box not found with the provided name",
      });
    }

    const boxDoc = boxQuerySnapshot.docs[0].data();
    logger.info("BOX", boxDoc);
    const fullnessPercentage = calculateFullnessPercentage(boxDoc, fullness);


    const report: ReportModel = {
      id: entry.id,
      name: name,
      created_at: new Date(),
      fullness: fullnessPercentage,
      battery: battery,
      network: network,
    };

    await entry.set(report);

    const reportDto: ReportDto = {
      name: report.name,
      address: boxDoc.address,
      fullness: report.fullness,
      battery: report.battery,
      network: report.network,
    };

    return res.status(200).json(
      {
        status: "success",
        message: "entry added successfully",
        data: reportDto,
      }
    );
  } catch (error) {
    return res.status(500).json("We found an error posting your request!");
  }
};

const calculateFullnessPercentage = (
  boxData: DocumentData,
  fullness: number
): number => {
  logger.info("sh", boxData.sensorHeight, "f", fullness, "h", boxData.height);
  const percentage = (boxData.sensorHeight - fullness) / boxData.height * 100;
  logger.info("percentage", percentage);
  return Math.round(percentage);
};

const getAllReports = async (req: ReportRequest, res: Response) => {
  try {
    const allEntries: ReportModel[] = [];
    const querySnapshot = await db.collection("reports").get();
    querySnapshot.forEach((doc: any) => allEntries.push(doc.data()));

    return res.status(200).json(allEntries);
  } catch (error) {
    return res.status(500).json("We found an error fetching your request!");
  }
};

const getLastReports = async (req: ReportRequest, res: Response) => {
  try {
    const querySnapshot = await db.collection("reports").get();

    const groupedDocs: any = {};
    querySnapshot.forEach((doc: any) => {
      const data = doc.data();
      const name = data.name;
      if (!groupedDocs[name] ||
        (data.created_at > groupedDocs[name].created_at)) {
        groupedDocs[name] = {id: doc.id, ...data};
      }
    });

    const lastDocuments = Object.values(groupedDocs);
    return res.status(200).json(lastDocuments);
  } catch (error) {
    return res.status(500).json("We found an error fetching your request!");
  }
};

const deleteReport = async (req: ReportRequest, res: Response) => {
  const {params: {entryId}} = req;

  try {
    const entry = await db.collection("reports").doc(entryId);
    await entry.delete().catch((error) => {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
    return res.status(200).json({
      status: "success",
      message: "entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json("We found an error updating an entry!");
  }
};

export {addReport, getAllReports, deleteReport, getLastReports};
