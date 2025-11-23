import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
export const newUser = TryCatch(async (req, res, next) => {
    //return next(new ErrorHandler("Mera Custom Error",402));// iska mtlb hai next middle ware ko call krdo this is my error middleware
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
        });
    }
    if (!_id || !name || !email || !photo || !gender || !dob) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }
    user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
    });
    return res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`,
    });
});
//details for all the users
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find();
    return res.status(201).json({
        success: true,
        users,
    });
});
//get user by id
export const getUsers = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const users = await User.findById(id);
    if (!users) {
        return next(new ErrorHandler("User not found", 404));
    }
    return res.status(201).json({
        success: true,
        users,
    });
});
//delete user 
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const users = await User.findById(id);
    if (!users) {
        return next(new ErrorHandler("User not found", 404));
    }
    await users.deleteOne();
    return res.status(201).json({
        success: true,
        users,
        message: "User deleted successfully",
    });
});
//lets create a search route 
