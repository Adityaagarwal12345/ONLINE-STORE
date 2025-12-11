import { Request, Response, NextFunction } from "express";
import {User} from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
import bcrypt from "bcrypt";

//create new user
export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {

    const { name, email, photo, gender, _id, dob, password } = req.body;

    if (!name || !email || !photo || !gender || !dob || !_id || !password) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    // Already exists?
    let user = await User.findById(_id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      _id,
      name,
      email,
      photo,
      gender,
      dob: new Date(dob),
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  }
);

//login user (email+password)
export const loginUser = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please enter email & password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user)
    return next(new ErrorHandler("User not found", 404));

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return next(new ErrorHandler("Incorrect password", 401));

  return res.status(200).json({
    success: true,
    message: `Welcome back, ${user.name}`,
    user,
  });
});

//details for all the users
export const getAllUsers= TryCatch(async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const users = await User.find();    
    return res.status(201).json({
        success:true,
        users,
    });
});
//get user by id
export const getUsers= TryCatch(async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const id = req.params.id;
    const users = await User.findById(id); 
    if(!users){
        return next(new ErrorHandler("User not found",404));
    }   
    return res.status(201).json({
        success:true,
        users,
    });
});
//delete user 
export const deleteUser= TryCatch(async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const id = req.params.id;
    const users = await User.findById(id); 
    if(!users){
        return next(new ErrorHandler("User not found",404));
    }   
    await users.deleteOne();
    return res.status(201).json({
        success:true,
        users,
        message:"User deleted successfully",
    });
});

//lets create a search route 
