import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const forFreelancersOnly = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId || req.params.userId || req.body.userId;
    if (!userId) throw new ApiError(401, "userId is required");

    let user;

    try {
        user = await User.findById(userId);
    } catch (error) {
        console.log('error ::: ', error);
        throw new ApiError(401, "Invalid userId, Not acceptable");
    }

    if (!user) throw new ApiError(401, "userId is Invalid");
    if (user.role !== 'freelancer') throw new ApiError(401, "Only Freelancers are allowed");

    req.user = user;
    next();
});

export const forClientsOnly = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId || req.params.userId || req.body.userId;
    if (!userId) throw new ApiError(401, "userId is required");

    let user;

    try {
        user = await User.findById(userId);
    } catch (error) {
        console.log('error ::: ', error);
        throw new ApiError(401, "Invalid userId, Not acceptable");
    }

    if (!user) throw new ApiError(401, "userId is Invalid");
    if (user.role !== 'client') throw new ApiError(401, "Only clients are allowed to create, update and delete jobs");

    req.user = user;
    next();
});


export const forOwnerOnly = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId || req.params.userId || req.body.userId;
    const jobId = req.query.jobId || req.params.jobId || req.body.jobId;

    if (!userId) throw new ApiError(401, "userId is required");
    if (!jobId) throw new ApiError(401, "jobId is required");

    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(401, "Job not found");

    if (user._id.toString() !== job.createdBy.toString()) throw new ApiError(401, "Access Denied");

    req.job = job;
    next();
});