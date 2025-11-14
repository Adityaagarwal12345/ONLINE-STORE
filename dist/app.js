import express from "express";
import userRoutes from "./routes/user.js";
const port = 3000;
const app = express();
app.get("/", (req, res) => {
    res.send("Welcome to E-commerce with /api/v1/user for user routes");
});
app.use("api/vi/user", userRoutes);
app.listen(port, () => {
    console.log(`express is running on http://localhost:${port}`);
});
export default app;
