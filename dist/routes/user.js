import express from "express";
import { newUser, loginUser, getAllUsers, getUsers, deleteUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();
router.post("/new", newUser);
router.post("/login", loginUser);
router.get("/all", adminOnly, getAllUsers);
router.route("/:id")
    .get(getUsers)
    .delete(adminOnly, deleteUser);
export default router;
