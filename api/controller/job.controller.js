import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createJob = asyncHandler(async (req, res) => {
    const { userId, title, description } = req.body;
    const job = await Job.create({ createdBy: userId, title, description });

    const createdJob = await Job.findById(job._id);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { job: createdJob },
                "Job created successfully"
            )
        );
});

export const updateJob = asyncHandler(async (req, res) => {
    const { userId, title, description } = req.job;

    const updatedJob = await Job.findByIdAndUpdate(job._id, { title, description }, { new: true });
    if(!updatedJob) throw new ApiError(401, "Failed to update job");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { job: updatedJob },
                "Job updated successfully"
            )
        );
});

export const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findByIdAndDelete(req.body.jobId);
    if (!job) throw new ApiError(409, "Failed to Delete: Job not found.");

    if (job.createdBy !== req.body.userId) throw new ApiError(409, "Failed: Access denied");

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                { job },
                "Job deleted successfully"
            )
        );
});

export const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({});

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                { jobs },
                "All Jobs fetched successfully"
            )
        );
});