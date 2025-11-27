import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import NodeCache from "node-cache";
const port = 3000;
const app = express();
connectDB();
export const myCache = new NodeCache();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Welcome to E-commerce with /api/v1/user for user routes");
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
//middle ware for handling errors
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`express is running on http://localhost:${port}`);
});
export default app;
