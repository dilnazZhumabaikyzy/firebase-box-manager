import jwt from "jsonwebtoken";
import {db} from "../config/firebase";
import User from "../model/user";
import {logger} from "firebase-functions";

const refreshSecret: string = process.env.JWT_REFRESH_SECRET || "";
const accessSecret: string = process.env.JWT_ACCESS_SECRET || "";

const generateToken = (payload: User) => {
  if (refreshSecret && accessSecret) {
    const accessToken = jwt.sign(payload,
      accessSecret,
      {expiresIn: "1h"},
    );

    const refreshToken = jwt.sign(payload,
      refreshSecret,
      {expiresIn: "15d"},
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  return null;
};

const saveRefreshToken = async (
  phoneNumber: string | undefined,
  refreshToken: string) => {
  if (phoneNumber != null) {
    const tokenRef = await db.collection("tokens").doc(phoneNumber);
    await tokenRef.set({refreshToken});
    return (await tokenRef.get()).data();
  } else {
    throw Error("Error when saving refresh token");
  }
};

const removeToken = async (phoneNumber: string) => {
  const tokenRef = await db.collection("tokens").doc(phoneNumber).delete();
  return tokenRef;
};

const validateRefreshToken = (token: string): User | null => {
  try {
    if (!refreshSecret) {
      return null;
    }

    const userData = jwt.verify(token, refreshSecret) as unknown as User;
    return userData;
  } catch (e) {
    return null;
  }
};

const validateAccessToken = (token: string): User | null => {
  try {
    if (!accessSecret) {
      return null;
    }

    const userData = jwt.verify(token, accessSecret) as unknown as User;
    return userData;
  } catch (e) {
    return null;
  }
};

const findToken = async (token: string): Promise<null |
  FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> => {
  try {
    if (!refreshSecret) {
      return null;
    }

    const userData = jwt.verify(token, refreshSecret) as unknown as User;
    logger.debug(userData.phoneNumber);
    const tokenRef = await db.collection("tokens")
      .doc(userData.phoneNumber).get();
    if (tokenRef.exists) {
      return tokenRef;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export {
  generateToken,
  saveRefreshToken,
  removeToken,
  validateRefreshToken,
  validateAccessToken,
  findToken,
};
