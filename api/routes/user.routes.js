import { Router } from "express";
import { deleteUser, getAllUsers, getPublicProfile, getUserProfile, getUserStats, isUsernameUnique, loginUser, logoutUser, refreshTokens, registerUser, removeJobsDataFromAllUsers } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);

router.route("/profile").post(verifyJWT, getUserProfile);
router.route("/profile/stats").get(verifyJWT, getUserStats);

router.route("/profile/:username").post(getPublicProfile);


router.route("/check-username").post(isUsernameUnique);

router.route("/refresh-tokens").post(refreshTokens);

// ADMIN routes
router.route("/all").get(getAllUsers);

router.route("/delete").get(deleteUser);

router.route("/remove-all/users/jobs-data/admin").delete(removeJobsDataFromAllUsers);

export { router as userRouter };