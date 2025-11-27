import express from 'express';
import { createFakeProducts, deleteProduct, getAdminProducts, getallcategories, getlatestProducts, getSingleProduct, newProduct, searchProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from '../middlewares/multer.js';
const app = express.Router();
app.post("/new", singleUpload, newProduct);
app.get("/latest", getlatestProducts);
app.get("/categories", getallcategories);
app.get("/Admin-product", getAdminProducts);
app.get("/all", searchProduct);
app.get("/faker", createFakeProducts);
app.route("/:id").get(getSingleProduct).put(singleUpload, updateProduct).delete(deleteProduct);
//to get all prodcuts with filter
export default app;
