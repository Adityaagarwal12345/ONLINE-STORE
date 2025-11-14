import { User } from "../models/user";
export const newUser = async (req, res, next) => {
    try {
        const { name, email, photo, gender, role, _id, dob } = req.body;
        const user = await User.create({
            name,
            email,
            photo,
            gender,
            role,
            _id,
            dob,
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
