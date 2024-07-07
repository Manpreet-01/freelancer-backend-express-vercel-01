import { Router } from "express";
import { deleteUser, getAllUsers, getPublicProfile, getUserProfile, isUsernameUnique, loginUser, logoutUser, refreshTokens, registerUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);

router.route("/profile").post(verifyJWT, getUserProfile);
router.route("/profile/:username").post(getPublicProfile);

router.route("/check-username").post(isUsernameUnique);

router.route("/refresh-tokens").post(refreshTokens);

// ADMIN routes
router.route("/all").get(getAllUsers);

router.route("/delete").get(deleteUser);

export { router as userRouter };