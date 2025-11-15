import mongoose from "mongoose";
export const connectDB = () => {
    mongoose.connect("mongodb://localhost:27017", {
        dbName: "Ecommerce_24",
    }).then((c) => console.log(`DB connected to ${c.connection.name}`))
        .catch((e) => console.log(e));
};
