import { Router } from "express";
import { deleteUser, getAllUsers, getUserProfile, isUsernameUnique, loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

router.route("/profile").post(verifyJWT, getUserProfile);

router.route("/check-username").post(isUsernameUnique);

// ADMIN routes
router.route("/all").get(getAllUsers);

router.route("/delete").get(deleteUser);

export { router as userRouter };