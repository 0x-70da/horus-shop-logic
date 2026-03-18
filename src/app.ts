import express from 'express';
import cors from 'cors';
const app: express.Application = express();
import router from "./routes.js"
import cookieParser from 'cookie-parser';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use("/api", router);

export default app;