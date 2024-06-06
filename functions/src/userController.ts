import {Request, Response} from "express";
import {db} from "./config/firebase";
import {logger} from "firebase-functions";
import {UserRequest} from "./request/responsesRequests";
import User from "./model/user";
import {UserDto} from "./dto/userDto";

const getUsers = async (req: Request, res: Response) => {
  try {
    const user: UserDto | undefined = req.user;
    logger.debug("author", user);
    const users = await db.collection("users").get();
    const usersList = users.docs.map((doc) => doc.data());
    logger.debug("Users", usersList);

    return res.status(200).json(usersList);
  } catch (error) {
    logger.error(error);
    return res.status(500).json("We found an error fetching your request!");
  }
};

const getUserById = async (req: UserRequest, res: Response) => {
  try {
    const {username} = req.params;

    const user = await db.collection("users")
      .doc(username).get();

    if (!user.data()) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    logger.debug("User", user.data());
    return res.status(200).json(user.data());
  } catch (error) {
    logger.error(error);
    return res.status(500).json("We found an error fetching your request!");
  }
};

const addUser = async (req: UserRequest, res: Response) => {
  try {
    const user: User = req.body;
    if (user.name && user.telegramUsername && user.role) {
      const userRef = await db.collection("users")
        .doc(user.telegramUsername).set({...user});

      return res.status(200).json({
        status: "success",
        message: "entry added successfully",
        data: userRef,
      });
    }

    return res.status(400).json({
      status: "error",
      message: "bad request",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json("We found an error fetching your request!");
  }
};

const updateUser = async (req: UserRequest, res: Response) => {
  try {
    const user: User = req.body;
    const params = req.params;

    const updatedUser = await db.collection("users")
      .doc(params.username).update({...user}).catch((e) => {
        logger.error("error when updating document", e);
        return res.status(400).json({
          status: "error",
          message: e.message,
        });
      });

    return res.status(200).json({
      status: "success",
      message: "entry updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json("We found an error fetching your request!");
  }
};

const deleteUser = async (req: UserRequest, res: Response) => {
  try {
    const params = req.params;

    await db.collection("users")
      .doc(params.username).delete().catch((error) => {
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
    logger.error(error);
    return res.status(500).json("We found an error fetching your request!");
  }
};

export {getUsers, addUser, updateUser, deleteUser, getUserById};
