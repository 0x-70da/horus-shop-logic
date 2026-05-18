import express from "express";
import cors from "cors";
const app: express.Application = express();
import router from "./routes.js";
import cookieParser from "cookie-parser";
import stripeRouter from "./features/payments/payments.routes.js";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const allowedOrigins = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)
  .map((o) => o.replace(/\/$/, ""));

app.use("/api/stripe/webhook", stripeRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser / same-origin requests may have no Origin header.
      if (!origin) return callback(null, true);

      const normalized = origin.replace(/\/$/, "");

      if (!IS_PRODUCTION) return callback(null, true);

      if (allowedOrigins.includes(normalized)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api", router);

export default app;
