import {Response} from "express";
import {db} from "./config/firebase";

type BoxType = {
  name: string,
  type: string,
  address: string,
  height: number,
  width: number,
  length: number,
  isActive: boolean,
  sensorHeight: number,
}

type Request = {
  body: BoxType,
  params: {entryId: string},
}

const addBox = async (req: Request, res: Response) => {
  const {
    name,
    type,
    height,
    width,
    length,
    address,
    sensorHeight,
    isActive,
  } = req.body;
  try {
    const entry = db.collection("boxes").doc();
    const entryObject = {
      id: entry.id,
      name: name,
      type: type,
      height: height,
      width: width,
      length: length,
      address: address,
      sensorHeight: sensorHeight,
      isActive: isActive,
    };

    await entry.set(entryObject);

    res.status(200).send({
      status: "success",
      message: "entry added successfully",
      data: entryObject,
    });
  } catch (error) {
    res.status(500).json("We found an error posting your request!");
  }
};

const getAllBoxes = async (req: Request, res: Response) => {
  try {
    const allEntries: BoxType[] = [];
    const querySnapshot = await db.collection("boxes").get();
    querySnapshot.forEach((doc: any) => allEntries.push(doc.data()));

    return res.status(200).json(allEntries);
  } catch (error) {
    return res.status(500).json("We found an error fetching your request!");
  }
};

const updateBox = async (req: Request, res: Response) => {
  const {
    body: {
      name,
      type,
      height,
      width,
      length,
      address,
      sensorHeight,
      isActive,
    },
    params: {
      entryId,
    }} = req;

  try {
    const entry = await db.collection("boxes").doc(entryId);
    const currentData = (await entry.get()).data() || {};
    const entryObject = {
      name: name || currentData.name,
      type: type || currentData.type,
      height: height || currentData.height,
      width: width || currentData.width,
      length: length || currentData.length,
      address: address || currentData.address,
      sensorHeight: sensorHeight || currentData.sensorHeight,
      isActive: isActive || currentData.isActive,
    };

    await entry.set(entryObject).catch((error) => {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });

    return res.status(200).json({
      status: "success",
      message: "entry updated successfully",
      data: entryObject,
    });
  } catch (error) {
    return res.status(500).json(
      "We found an error updating an entry!"
    );
  }
};

const deleteBox = async (req: Request, res: Response) => {
  const {params: {entryId}} = req;

  try {
    const entry = await db.collection("boxes").doc(entryId);
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

export {addBox, getAllBoxes, updateBox, deleteBox};
