import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const forFreelancersOnly = asyncHandler(async (req, res, next) => {
    if (!req.user) throw new ApiError(401, "jwt middlewere absent");
    if (req.user.role !== 'freelancer') throw new ApiError(401, "Only Freelancers are allowed");
    next();
});

export const forClientsOnly = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'client') throw new ApiError(401, "Not allowed");
    next();
});

export const forJobOwnerOnly = asyncHandler(async (req, res, next) => {
    const jobId = req.query.jobId || req.params.jobId || req.body.jobId;
    if (!jobId) throw new ApiError(401, "jobId is required");

    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(401, "Job not found");

    if (req.user._id.toString() !== job.createdBy.toString()) throw new ApiError(401, "Access Denied");

    req.job = job;
    next();
});