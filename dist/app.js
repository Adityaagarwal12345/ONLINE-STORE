import express from "express";
import { connectDB } from "./utils/db.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import { config } from "dotenv";
import NodeCache from "node-cache";
import morgan from 'morgan';
config({
    path: "./.env",
});
console.log(process.env.PORT);
const port = process.env.PORT || 3000; //4000 ya phir 3000
const mongoURI = process.env.MONGO_URI || "";
const app = express();
connectDB(process.env.MONGO_URI);
export const myCache = new NodeCache();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Welcome to E-commerce with /api/v1/user for user routes");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoute);
//middle ware for handling errors
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`express is running on http://localhost:${port}`);
});
export default app;
