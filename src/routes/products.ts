import express from 'express';
import { getallcategories, getlatestProducts, newProduct } from "../controllers/product.js"
import { adminOnly } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
const app = express.Router();
app.post("/new", singleUpload, newProduct);

app.get("/latest",getlatestProducts);

app.get("/categories",getallcategories);
export default app;
