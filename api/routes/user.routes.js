import { Router } from "express";
import { deleteUser, getAllUsers, isUsernameUnique, loginUser, logoutUser, registerUser } from "../controller/user.controller.js";


const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

router.route("/check-username").post(isUsernameUnique);

// ADMIN routes
router.route("/all").get(getAllUsers);

router.route("/delete").get(deleteUser);

export { router as userRouter };