import express from 'express';
import cors from 'cors';
const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/api", (await import("./routes.js")).default);

export default app;