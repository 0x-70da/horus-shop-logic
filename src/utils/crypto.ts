import crypto from 'crypto';
import logger from './logger.js';

export const generateToken = async (length: number = 32): Promise<{ rawToken: string; hashedToken: string; expiresAt: string }> => {
  try {
    const rawToken = crypto.randomBytes(length).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // Token expires in 1 hour
    return { rawToken, hashedToken, expiresAt };
  } catch (error) {
    logger("Error generating token:", error);
    throw new Error("Error generating token");
  }
}

export const hashToken = (token: string): string => {
  try {
    return crypto.createHash('sha256').update(token).digest('hex');
  } catch (error) {
    logger("Error hashing token:", error);
    throw new Error("Error hashing token");
  }
}