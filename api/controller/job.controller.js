import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createJob = asyncHandler(async (req, res) => {
    const { userId, title, description, categories, tags } = req.body;
    const job = await Job.create({ createdBy: userId, title, description, categories, tags });

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
    const { _id } = req.job;
    const { title, description, categories, tags } = req.body;

    // TODO: add support for updating categories and tags

    const updatedJob = await Job.findByIdAndUpdate(_id, { title, description, categories, tags }, { new: true });
    if (!updatedJob) throw new ApiError(401, "Failed to update job");

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


export const getJobById = asyncHandler(async (req, res) => {
    const jobId = req.params.id || req.query.id || req.body.id;
    if (!jobId) throw new ApiError(401, "jobId is required");

    const job = await Job.findById(jobId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                { job },
                "All job fetched successfully"
            )
        );
});

export const getClientJobs = asyncHandler(async (req, res) => {
    const clientId = req.params.id || req.query.id || req.body.id;
    if (!clientId) throw new ApiError(401, "clientId is required");

    const jobs = await Job.find({ createdBy: clientId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                { jobs },
                "All client jobs fetched successfully"
            )
        );
});
