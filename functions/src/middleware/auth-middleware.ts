import express, {NextFunction, Response} from "express";
import {validateAccessToken} from "../services/tokenService";

const authMiddleware = (
  req: express.Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(res.status(401).json({message: "Unauthorized user"}));
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return next(res.status(401).json({message: "Unauthorized user"}));
    }

    const userData = validateAccessToken(accessToken);

    if (!userData) {
      return next(res.status(401).json({message: "Unauthorized user"}));
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(res.status(401).json({message: "Unauthorized user"}));
  }
};

export default authMiddleware;
