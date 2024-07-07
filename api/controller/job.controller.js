import { Job } from "../models/job.model.js";
import { Proposal } from "../models/proposal.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createJob = asyncHandler(async (req, res) => {
    const { title, description, categories, tags } = req.body;

    const job = await Job.create({
        createdBy: req.user._id.toString(),
        title,
        description,
        categories,
        tags
    });

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
    const jobId = req.job._id.toString();
    const { title, description, categories, tags } = req.body;

    // TODO: add support for updating categories and tags

    const updatedJob = await Job.findByIdAndUpdate(jobId, { title, description, categories, tags }, { new: true });
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
    const job = await Job.findByIdAndDelete(req.job._id.toString());
    if (!job) throw new ApiError(409, "Failed to Delete: Job not found.");

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
    const { user } = req;
    let jobs = await Job.find({});

    if (user.role == 'freelancer') {
        // Add isSaved / isApplied field to each job
        jobs = jobs.map(job => {
            const isSaved = user.savedJobs.includes(job._id);
            const isApplied = user.appliedJobs.includes(job._id);
            return { ...job.toObject(), isSaved, isApplied };
        });
    }

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
    const { user } = req;
    const jobId = req.params.id || req.query.id || req.body.id;
    if (!jobId) throw new ApiError(401, "jobId is required");

    const fetchedJob = await Job.findById(jobId);
    const job = fetchedJob.toObject();

    if (user.role === 'freelancer') {
        job.isSaved = user.savedJobs.includes(job._id);
        job.isApplied = user.appliedJobs.includes(job._id);
        if (job.isApplied) job.proposal = await Proposal.findOne({ job: job._id, user: user._id });
    }

    if (user.role === 'client') {
        job.proposals = await Proposal.find({ job: job._id })
            .populate({ path: 'user', select: 'name username' });
    }

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
    const jobs = await Job.find({ createdBy: req.user._id.toString() });

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


export const toggleJobIsSaved = asyncHandler(async (req, res) => {
    const { user } = req;
    const { jobId } = req.body;
    if (!jobId) throw new ApiError(401, "jobId is required");

    let isSaved = null;

    if (user.savedJobs.includes(jobId)) {
        user.savedJobs.pull(jobId);
        isSaved = false;
    } else {
        user.savedJobs.push(jobId);
        isSaved = true;
    }

    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                { isSaved },
                "Job isSaved status toggled successfully"
            )
        );
});