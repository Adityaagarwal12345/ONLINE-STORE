import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import { invalidateCache } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
//Revalidate on when a new  update or delete and new order product  
export const getlatestProducts = TryCatch(async (req, res, next) => {
    let products = [];
    if (myCache.has("latest-product"))
        products = JSON.parse(myCache.get("latest-product"));
    else {
        products = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(5);
        myCache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products, // 👈 yeh bhejna zaroori hai bro
    });
});
export const getallcategories = TryCatch(async (req, res, next) => {
    let categories;
    // Check cache
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories"));
    }
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories)); // store in cache
    }
    return res.status(200).json({
        success: true,
        categories,
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;
    // Check cache
    if (myCache.has("admin-products")) {
        products = JSON.parse(myCache.get("admin-products"));
    }
    else {
        products = await Product.find({});
        myCache.set("admin-products", JSON.stringify(products)); // save in cache
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    let product;
    // Check cache first
    if (myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Product not found", 404));
        await Product.create({
            name,
            price,
            stock,
            category: category.toLowerCase(),
            photo: photo.path,
        });
        await invalidateCache({ product: true });
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("please add photo", 400));
    if (!name || !price || !stock || !category)
        rm(photo.path, () => {
            console.log("Deleted");
        });
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(), // 👈 FINAL CORRECT SPELLING
        photo: photo?.path,
    });
    await invalidateCache({ product: true });
    return res.status(201).json({
        success: true,
        message: "Product created Successfully",
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    // 1) Check if product exists
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Invalid product ID", 400));
    // 2) If new photo uploaded -> delete old & save new path
    if (photo) {
        rm(product.photo, () => console.log("Old photo deleted"));
        product.photo = photo.path;
    }
    // 3) Update fields conditionally
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category.toLowerCase();
    // 4) Save changes
    await product.save();
    await invalidateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    rm(product.photo, () => console.log("Old photo deleted"));
    await Product.deleteOne();
    await invalidateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: "product deleted successfully",
    });
});
//search new product
export const searchProduct = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    // search by name (regex)
    if (search) {
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    }
    // filter by price (less than or equal)
    if (price) {
        baseQuery.price = {
            $lte: Number(price),
        };
    }
    // filter by category
    if (category) {
        baseQuery.category = String(category).toLowerCase();
    }
    // Fetch data + total count in parallel (FAST ⚡)
    const [products, filteredOnlyProducts] = await Promise.all([
        Product.find(baseQuery)
            .sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined)
            .limit(limit)
            .skip(skip),
        Product.find(baseQuery), // for total count
    ]);
    const totalPage = Math.ceil(filteredOnlyProducts.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
        currentPage: page,
    });
});
// export const createFakeProducts = TryCatch(
//   async (req, res, next) => {
//     const productsToCreate = 50; // jitne chahiye utne number change kar do
//     const fakeProducts = [];
//     for (let i = 0; i < productsToCreate; i++) {
//       fakeProducts.push({
//         name: faker.commerce.productName(),
//         price: Math.floor(Math.random() * 90000) + 1000,
//         stock: Math.floor(Math.random() * 30) + 1,
//         category: faker.commerce.department().toLowerCase(),
//         photo: faker.image.url(), // Fake image URL de diya
//       });
//     }
//     await Product.insertMany(fakeProducts);
//     return res.status(201).json({
//       success: true,
//       message: `${productsToCreate} Fake Products Created Successfully!`,
//     });
//   }
// );
