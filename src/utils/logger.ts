import dotenv from "dotenv";
dotenv.config();

const logger = (...args: any[]) => {
  if (process.env.NODE_ENV === "production") {
    // Do nothing in production
  } else {
    console.log(...args);
  }
};

export default logger;
