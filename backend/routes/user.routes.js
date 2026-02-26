import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import isAuth from "../middleware/isAuth.js";

const userRouter = express.Router();

router.get("/current", isAuth, getCurrentUser);

export default userRouter;