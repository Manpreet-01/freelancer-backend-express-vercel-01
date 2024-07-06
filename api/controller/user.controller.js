import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("invalid refresh token");

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error(error.message);
        console.error(error);
        throw new ApiError(
            500,
            "Something went wrong while generating the access token"
        );
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password, role } = req.body;
    if (!name || !username || !email || !password || !role) throw new ApiError(409, "Invalid data payload");

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) throw new ApiError(409, "User with email or username already exists");

    const user = await User.create({ name, username, email, password, role: role });

    const createdUser = await User.findById(user._id).select(
        "-refreshToken -password"
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { user: createdUser },
                "Users registered successfully"
            )
        );
});

export const isUsernameUnique = asyncHandler(async (req, res) => {
    const { username } = req.body;
    if (!username) throw new ApiError(409, "username is required");

    const existedUser = await User.findOne({ username });

    const msg = existedUser ? "username is already taken" : "username is unique";

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                msg
            )
        );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!(username || email) || !password) throw new ApiError(409, "Invalid data payload");

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) throw new ApiError(409, "User does not exits");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    // TODO: Add more options to make cookie more secure and reliable
    const options = {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

export const getPublicProfile = asyncHandler(async (req, res) => {
    const { username } = req.body;
    if (!username) throw new ApiError(409, "username is required");

    const user = await User.findOne({ username }).select("-email -password");
    if (!user) throw new ApiError(409, "User does not exits");


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user },
                "User Public profile fetched successfully"
            )
        );
});

// PROTECTED ROUTES
export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id.toString(),
        {
            $set: {
                refreshToken: '',
            },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
    const { user } = req;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user },
                "User profile fetched successfully"
            )
        );
});

export const refreshTokens = asyncHandler(async (req, res) => {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) throw new ApiError(401, "Unauthorize request");

    const decodedToken = jwt.decode(oldRefreshToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken._id;
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userId);

    // TODO: Add more options to make cookie more secure and reliable
    const options = {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "tokens refreshed successfully"
            )
        );
});

// ADMIN routes
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('_id username role');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { users: users },
                "All the Users fetched successfully"
            )
        );

});


export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) throw new ApiError(409, "Id is requried");

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new ApiError(409, "Failed to delete use");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { users: user },
                "User deleted successfully"
            )
        );

});