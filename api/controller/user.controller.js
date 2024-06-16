import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, type } = req.body;
    if (!name || !username || !email || !type) throw new ApiError(409, "Name, Username, Email and type of account all are requried");

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) throw new ApiError(409, "User with email or username already exists");

    const user = await User.create({ name, username, email, type });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
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



export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('_id name username email type');

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