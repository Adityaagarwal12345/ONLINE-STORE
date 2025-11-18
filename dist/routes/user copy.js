import express from 'express';
import { deleteUser, getAllUsers, getUsers, newUser } from '../controllers/user.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();
//route -/api/v1/user/new
app.post("/new", newUser);
//route- /api/vi/user/all
app.get("/all", adminOnly, getAllUsers);
app.route("/:id").get(getUsers).delete(adminOnly, deleteUser);
//route- /api/vi/user/dynamic id
//app.get("/:id",getUsers);
//route for delete user- /api/vi/user/dynamic id
//app.get("/:id",deleteUser);
export default app;
