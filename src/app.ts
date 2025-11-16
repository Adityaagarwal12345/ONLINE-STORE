import express, { NextFunction } from "express";
import userRoutes from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { error } from "console";
import { errorMiddleware } from "./middlewares/error.js";
const port = 3000;

const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to E-commerce with /api/v1/user for user routes");
});

app.use("/api/v1/user",userRoutes);
//middle ware for handling errors
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`);
});

export default app;
