import mongoose from "mongoose";
import { OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";

export const connectDB = (uri:string) => {
    mongoose.connect(uri,{
    dbName:"Ecommerce_24",
    }).then((c)=>console.log(`DB connected to ${c.connection.name}`))
    .catch((e)=>console.log(e));
};


export const invalidateCache =async ({product,order,admin}:InvalidateCacheProps)=>{
    if(product){
        const productKeys: string[] = [
            "latest-products",
            "categories",
            "allProducts"
        ];

        const products = await Product.find({}).select("_id");
        products.forEach((i)=>{
           productKeys.push(`product-${i._id}`);
        });
        myCache.del(productKeys);
    }
    if(order){

    }
    if(order){

    }
}
//creating a functuion to reduce stock

export const reduceStock =async (orderItems:OrderItemType[])=>{
   for(let i=0;i<orderItems.length;i++){
    const order = orderItems[i];
    const product = await Product.findById(order.productId)
    if(!product) throw new Error("product not found");
    product.stock -=order.quantity;
    await product.save();
   }
}