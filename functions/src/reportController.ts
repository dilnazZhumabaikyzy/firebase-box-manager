import {Request, Response} from "express";
import {db} from "./config/firebase";
import {logger} from "firebase-functions";
import Report from "./model/report";
import {FullnessItem, ReportDto} from "./dto/reportDto";
import {ResponsesRequests} from "./request/responsesRequests";
import axios, {AxiosError, AxiosResponse} from "axios";

const addReport = async (req: Request, res: Response) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const {boxId} = req.params;
  const {query} = req;

  const fullness = (typeof query.fullness === "string") ? query.fullness : "";

  if (fullness != undefined && fullness === "") {
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

      // await boxRef.update({
      //   battery: battery,
      //   networkSignal: network,
      // });

      box = await boxRef.get();

      const boxData = box.data();

      const fullnessPercentage =
        calculateFullnessPercentage(boxData, parseInt(fullness));
      // || battery <= 15
      // fullnessPercentage >= 90
      if (fullness) {
        const usersSnapshot = await db.collection("users")
          .where("receiveNotifications", "==", true)
          .get();
        const users = usersSnapshot.docs;
        for (const user of users) {
          logger.info("USER", user.data());
          let notificationText = "🔔Новое уведомление🔔\n";
          // notificationText = fullness >= 90 && battery > 15 ?
          notificationText +=
            // `Бокс "${boxData?.name}" заполнен на ${fullnessPercentage}%`;
            `Бокс "${boxData?.name}"\n Температура: ${fullness} C`;
          // fullness >= 90?
          // `Заряд бокса "${boxData?.name}" ниже 15%
          // \n Заряд батареи: ${battery}%`;
          await axios.post(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              chat_id: user.data().chatId,
              text: notificationText,
            }
          ).then((response: AxiosResponse) => logger.info(response.data))
            .catch((error: AxiosError) => logger.error(error));
        }
      }

      if (fullnessPercentage >= 0) {
        const report: Report = {
          created_at: new Date(),
          fullness: fullnessPercentage,
          fullnessInSM: Number(fullness),
        };

        await reportEntry.set(report);

        const reportDto: ReportDto = {
          id: boxData?.id,
          address: boxData?.address,
          fullness: report.fullness,
          sleepTimeMinutes: boxData?.sleepTimeMinutes,
          fullnessInSM: Number(fullness),
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
    return res.status(500).json("We fo" +
      "und an error posting your request!");
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

const getLastReportsController = async (
  req: ResponsesRequests,
  res: Response) => {
  try {
    const lastDocuments = await getLastReports();
    return res.status(200).json(lastDocuments);
  } catch (error: any) {
    return res.status(500).json({message: error?.message});
  }
};

const getLastReports = async () => {
  const boxes = (await db.collection("boxes").get()).docs;
  const groupedDocs: FullnessItem[] = [];
  for (const boxRef of boxes) {
    const box = boxRef.data();
    const reportRef = await db.collection("boxes").doc(box.id)
      .collection("reports");

    const query = await reportRef.orderBy("created_at", "desc").limit(1).get();
    query.forEach((doc) => {
      const docData = doc.data();
      const fullnessItem: FullnessItem = {
        fullness: docData.fullness,
        name: box?.name,
        fullnessInSM: docData.fullnessInSM,
        created_at: docData.created_at,
      };
      groupedDocs.push(fullnessItem);
    });
  }

  return groupedDocs;
};

const deleteReport = async (req: Request, res: Response) => {
  const {params: {boxId}} = req;

  try {
    const entry = await db.collection("reports").doc(boxId);
    const deletedEntry = await entry.delete().catch((error) => {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
    return res.status(200).json({
      status: "success",
      message: "entry deleted successfully",
      deletedEntry: deletedEntry,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json("We found an error deleting an entry!");
  }
};

export {
  addReport,
  getReportsOfBox,
  deleteReport,
  getLastReportsController,
  getLastReports,
};
