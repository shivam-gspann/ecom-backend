import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

//importing routes
import healthCheckRouter from "./routes/healthCheck.routes.js";
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/healthcheck", healthCheckRouter);
app.use("/users", userRouter);

export default app;