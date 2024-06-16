import { Router } from "express";
import { getAllUsers, registerUser } from "../controller/user.controller.js";


const router = Router();


router.route("/register").post(registerUser);

router.route("/all").get(getAllUsers);

export { router as userRouter };