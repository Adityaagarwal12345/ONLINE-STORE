import express from 'express';
import { getAdminProducts, getallcategories, getlatestProducts, newProduct } from "../controllers/product.js";
import { singleUpload } from '../middlewares/multer.js';
const app = express.Router();
app.post("/new", singleUpload, newProduct);
app.get("/latest", getlatestProducts);
app.get("/categories", getallcategories);
app.get("/Admin-product", getAdminProducts);
export default app;
