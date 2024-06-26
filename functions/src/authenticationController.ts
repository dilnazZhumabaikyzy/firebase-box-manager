import express from "express";
import {logger} from "firebase-functions";
import {db} from "./config/firebase";
import bcrypt from "bcrypt";
import {
  findToken,
  generateToken,
  removeToken,
  saveRefreshToken,
  validateRefreshToken,
} from "./services/tokenService";
import {validationResult} from "express-validator";
import User from "./model/user";
import {addUser} from "./userController";

const register = async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    logger.debug(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    return addUser(req, res);
  } catch (error) {
    logger.error("ERROR", error);
    return res.status(400).json({message: "Error when processing request"});
  }
};

const login = async (req: express.Request, res: express.Response) => {
  try {
    const {phoneNumber, password} = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({message: "Invalid Request body"});
    }

    const userRef = db.collection("users").doc(phoneNumber);
    const user = await userRef.get();

    if (!user.exists) {
      return res.status(400).json({
        message: "User with this phone number doesn't exists :(",
      });
    }
    const userData = user.data() as User;
    if (userData.password != null) {
      const isPassEquals = await bcrypt.compare(password, userData.password);
      logger.debug("Password test", password, userData.password, isPassEquals);
      if (!isPassEquals) {
        return res.status(400).json({
          message: "Incorrect password",
        });
      }
    } else {
      throw Error("users password doesnt exist");
    }

    const userDto: User = {
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      receiveNotifications: userData.receiveNotifications,
      name: userData.name,
    };

    const tokens = generateToken(userDto);

    if (tokens) {
      await saveRefreshToken(userDto.phoneNumber, tokens.refreshToken);
      res.cookie("refreshToken",
        tokens.refreshToken,
        {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.status(200).json({
        ...tokens,
        user: userDto,
      });
    }

    return res.status(400).json({
      message: "Error when parsing token",
    });
  } catch (error) {
    logger.error("ERROR", error);
    return res.status(400).json({message: "Error when processing request"});
  }
};

const logout = async (req: express.Request, res: express.Response) => {
  try {
    const {phoneNumber} = req.body;

    if (!phoneNumber) {
      return res.status(400).json({message: "Invalid Request body"});
    }

    const token = await removeToken(phoneNumber);

    res.clearCookie("refreshToken");
    return res.status(200).json({
      token: token,
    });
  } catch (error) {
    logger.error("ERROR", error);
    return res.status(400).json({message: "Error when processing request"});
  }
};

const refresh = async (req: express.Request, res: express.Response) => {
  try {
    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({message: "Unauthorized user"});
    }

    const refreshToken = authHeader.split(" ")[1];

    logger.debug(refreshToken);
    if (!refreshToken) {
      return res.status(400).json({message: "Unauthorized user"});
    }

    const userDataFromToken = validateRefreshToken(refreshToken);
    const tokenFromDB = await findToken(refreshToken);

    if (!userDataFromToken || !tokenFromDB) {
      return res.status(400).json({
        message: "User with this phone number doesn't exists :(",
      });
    }

    const userDto: User = {
      phoneNumber: userDataFromToken.phoneNumber,
      role: userDataFromToken.role,
      receiveNotifications: userDataFromToken.receiveNotifications,
      name: userDataFromToken.name,
    };

    const tokens = generateToken(userDto);

    if (tokens) {
      await saveRefreshToken(userDto.phoneNumber, tokens.refreshToken);
      res.cookie("refreshToken",
        tokens.refreshToken,
        {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.status(200).json({
        ...tokens,
        user: userDto,
      });
    }

    return res.status(400).json({
      message: "Error when parsing token",
    });
  } catch (error) {
    logger.error("ERROR", error);
    return res.status(400).json({message: "Error when processing request"});
  }
};


export {register, login, logout, refresh};
