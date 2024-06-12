import User from "../model/user";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
