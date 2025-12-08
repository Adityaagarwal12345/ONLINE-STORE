import { Product } from "../models/products.js";
import { Order } from "../models/order.js";
import NodeCache from "node-cache";

export const myCache = new NodeCache();

export interface InvalidateCacheProps {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
}

export const invalidateCache = async ({
  product,
  order,
  admin,
}: InvalidateCacheProps) => {
  if (product) {
    const products = await Product.find({}).select("_id");
    products.forEach((p) =>
      myCache.del(`product-${p._id}`)
    );
    myCache.del("latest-products");
    myCache.del("categories");
    myCache.del("all-products-admin");
  }

  if (order) {
    const orders = await Order.find({}).select("_id user");
    orders.forEach((o) =>
      myCache.del(`my-orders-${o.user.toString()}`)
    );
    myCache.del("all-orders");
  }

  if (admin) {
    myCache.del("admin-stats");
  }
};

export const reduceStock = async (orderItems: any[]) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    product.stock -= item.quantity;
    await product.save();
  }
};
