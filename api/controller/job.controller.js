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
    const updatedData = { title, description, categories, tags };

    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedData, { new: true });
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
    let jobs = await Job.find({}).select("-createdBy -__v").sort({ createdAt: -1 }).populate({
        path: 'proposals',
        match: { user: user._id },
        select: 'status'
    });

    if (user.role == 'freelancer') {
        // Add isSaved / isApplied field to each job
        jobs = jobs.map(job => {
            const isSaved = user.savedJobs.includes(job._id);
            const isApplied = user.appliedJobs.includes(job._id);
            const isWithdrawn = user.withdrawnProposals.includes(job._id);
            const proposal = job.proposals?.length ? job.proposals[0] : undefined;
            return { ...job.toObject(), isSaved, isApplied, isWithdrawn, proposal, proposals: undefined };
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
    job.proposalsCount = job.proposals?.length;

    if (user.role === 'freelancer') {
        job.isSaved = user.savedJobs.includes(job._id);
        job.isApplied = user.appliedJobs.includes(job._id);
        job.isWithdrawn = user.withdrawnProposals.includes(jobId);
        job.proposals = undefined;
        if (job.isApplied) job.proposal = await Proposal.findOne({ job: job._id, user: user._id });
    }

    if (user.role === 'client') {
        const proposals = await Proposal.find({ job: job._id }).populate({
            path: 'user',
            select: '-_id name username isAvailableNow'
        });

        job.proposals = proposals.map(proposal => ({
            ...proposal.toObject(),
            isWithdrawn: proposal.withdrawn,
            withdrawn: undefined,
        }));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                { job },
                "Job fetched successfully"
            )
        );
});

export const getClientJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user._id.toString() }).sort({ createdAt: -1 }).select('-__v');

    const jobsWithProposalCount = jobs.map(job => ({
        ...job.toObject(),
        proposalsCount: job.proposals.length,          // add proposals count
        proposals: undefined,                           // remove field
    }));

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                { jobs: jobsWithProposalCount },
                "All Jobs of a client fetched successfully"
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

// TODO: add validation, so only admin can access
export const removeAllJobsProposals = asyncHandler(async (req, res) => {
    const updatedData = { proposals: [] };
    const jobsWithRemovedProposals = await Job.updateMany({}, updatedData, { new: true });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { jobs: jobsWithRemovedProposals },
                "Proposals from all Jobs removed successfully"
            )
        );
});