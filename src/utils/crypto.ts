import crypto from "crypto";
import logger from "./logger.js";

export const generateTokenAndCode = async (
  length: number = 32,
): Promise<{
  rawToken: string;
  hashedToken: string;
  resetCode: string;
  hashedResetCode: string;
  expiresAt: string;
}> => {
  try {
    const rawToken = crypto.randomBytes(length).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const resetCode = crypto
      .randomBytes(6)
      .toString("hex")
      .slice(0, 6)
      .toUpperCase();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // Token expires in 1 hour
    return { rawToken, hashedToken, resetCode, hashedResetCode, expiresAt };
  } catch (error) {
    logger("Error generating token:", error);
    throw new Error("Error generating token");
  }
};

export const hashTokenOrCode = (token: string): string => {
  try {
    return crypto.createHash("sha256").update(token).digest("hex");
  } catch (error) {
    logger("Error hashing token:", error);
    throw new Error("Error hashing token");
  }
};
