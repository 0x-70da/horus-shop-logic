import express from 'express';
import cors from 'cors';
const app: express.Application = express();
import router from "./routes.js"
import cookieParser from 'cookie-parser';
import stripeRouter from "./features/payments/payments.routes.js";

app.use("/api/stripe/webhook", stripeRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(cookieParser());
app.use("/api", router);

export default app;