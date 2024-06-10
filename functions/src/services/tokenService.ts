import jwt from "jsonwebtoken";
import {db} from "../config/firebase";
import {UserDto} from "../dto/userDto";
import User from "../model/user";

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
      {expiresIn: "30d"},
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

const removeToken = async (username: string) => {
  const tokenRef = await db.collection("tokens").doc(username).delete();
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

const validateAccessToken = (token: string): UserDto | null => {
  try {
    if (!accessSecret) {
      return null;
    }

    const userData = jwt.verify(token, accessSecret) as unknown as UserDto;
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

    const userData = jwt.verify(token, refreshSecret) as unknown as UserDto;
    const tokenRef = await db.collection("tokens").doc(userData.username).get();
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
