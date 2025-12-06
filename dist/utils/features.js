import mongoose from "mongoose";
import { myCache } from "../app.js";
export const connectDB = (uri) => {
    mongoose.connect(uri, {
        dbName: "Ecommerce_24",
    }).then((c) => console.log(`DB connected to ${c.connection.name}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = async ({ product, order, admin }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "allProducts"
        ];
        const products = await Product.find({}).select("_id");
        products.forEach((i) => {
            productKeys.push(`product-${i._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
    }
    if (order) {
    }
};
