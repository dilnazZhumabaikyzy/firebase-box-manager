import {Response} from "express";
import {db} from "./config/firebase";
import {logger} from "firebase-functions";
import Report from "./model/report";
import ReportDto from "./dto/reportDto";
import {ResponsesRequests} from "./request/responsesRequests";

const addReport = async (req: ResponsesRequests, res: Response) => {
  const {
    fullness,
    battery,
    network,
  } = req.body;

  const {
    boxId,
  } = req.params;

  if (!fullness || !battery || !network) {
    return res.status(404).json({
      status: "error",
      message: "Bad ResponsesRequests",
    });
  }

  try {
    const boxRef = await db.collection("boxes").doc(boxId);
    let box = await boxRef.get();
    if (box.exists) {
      const reportEntry = db.collection("boxes").doc(boxId)
        .collection("reports").doc();
      logger.info("BAT ANS NET", {battery, network});

      await boxRef.update({
        battery: battery,
        networkSignal: network,
      });

      box = await boxRef.get();

      const boxData = box.data();

      const fullnessPercentage =
        calculateFullnessPercentage(boxData, fullness);

      if (fullnessPercentage >= 0) {
        const report: Report = {
          created_at: new Date(),
          fullness: fullnessPercentage,
        };

        await reportEntry.set(report);

        const reportDto: ReportDto = {
          id: boxData?.id,
          address: boxData?.address,
          fullness: report.fullness,
          battery: boxData?.battery,
          network: boxData?.networkConnection,
          sleepTimeMinutes: boxData?.sleepTimeMinutes,
        };

        return res.status(200).json({
          status: "success",
          message: "entry added successfully",
          data: reportDto,
        });
      }

      return res.status(404).json({
        status: "error",
        message: "box data is empty",
      });
    }

    return res.status(404).json({
      status: "error",
      message: "Box not found with the provided name",
    });
  } catch (error) {
    return res.status(500).json("We found an error posting your request!");
  }
};

const calculateFullnessPercentage = (
  boxData: FirebaseFirestore.DocumentData | undefined,
  fullness: number
): number => {
  if (!boxData) return -1;

  const percentage = (boxData.sensorHeight - fullness) / boxData.height * 100;
  return Math.round(percentage);
};

const getReportsOfBox = async (req: ResponsesRequests, res: Response) => {
  try {
    const allEntries: Report[] = [];
    const {boxId} = req.params;
    const querySnapshot = await db.collection("boxes").doc(boxId)
      .collection("reports").get();

    querySnapshot.forEach((doc: any) => allEntries.push(doc.data()));
    return res.status(200).json(allEntries);
  } catch (error) {
    return res.status(500).json("We found an error fetching your request!");
  }
};

const getLastReports = async (req: ResponsesRequests, res: Response) => {
  try {
    const boxes = (await db.collection("boxes").get()).docs;
    const groupedDocs: any = [];
    for (const boxRef of boxes) {
      const box = boxRef.data();
      const reportRef = await db.collection("boxes").doc(box.id)
        .collection("reports");

      const query = reportRef.orderBy("created_at", "desc").limit(1);
      (await query.get())
        .forEach((doc) => groupedDocs.push(doc.data()));
    }

    const lastDocuments = Object.values(groupedDocs);
    return res.status(200).json(lastDocuments);
  } catch (error: any) {
    return res.status(500).json({message: error?.message});
  }
};


const deleteReport = async (req: ResponsesRequests, res: Response) => {
  const {params: {boxId}} = req;

  try {
    const entry = await db.collection("reports").doc(boxId);
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

export {addReport, getReportsOfBox, deleteReport, getLastReports};
