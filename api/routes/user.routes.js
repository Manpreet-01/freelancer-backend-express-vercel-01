import { Router } from "express";
import { deleteUser, getAllUsers, registerUser } from "../controller/user.controller.js";


const router = Router();


router.route("/register").post(registerUser);

router.route("/all").get(getAllUsers);

router.route("/delete").get(deleteUser);

export { router as userRouter };