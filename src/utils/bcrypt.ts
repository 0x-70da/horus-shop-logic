import bcrypt from "bcrypt";
import logger from "./logger.js";

export const hash = async (
  raw: string,
  saltRounds: number = 10,
): Promise<string> => {
  try {
    return await bcrypt.hash(raw, saltRounds);
  } catch (error) {
    logger("Error hashing password or token:", error);
    throw new Error("Error hashing password or token");
  }
};

export const compare = async (
  raw: string,
  hashed: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(raw, hashed);
  } catch (error) {
    logger("Error comparing password or token:", error);
    throw new Error("Error comparing password or token");
  }
};
