import crypto from "crypto";
const SECRET = "TEST";

export const authentication = (salt: string, password: string) => {
  return crypto.createHmac("sha256", [salt, password].join("/"))
    .update(SECRET).digest("hex");
};
