import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Proposal } from "../models/proposal.model";
import { Job } from "../models/job.model";
import { User } from "../models/user.model";


export const createProposal = asyncHandler(async (req, res) => {
    const { jobId, userId, coverLetter } = req.body;

    // TODO: Improve logic for validations and add also for data-types
    if (!jobId) throw new ApiError(401, "jobId is required");
    if (!userId) throw new ApiError(401, "userId is required");
    if (!coverLetter) throw new ApiError(401, "coverLetter is required");

    const existingProposal = await Proposal.findOne({ job: jobId, user: userId });
    if (existingProposal) throw new ApiError(401, "You already apply for this job.");

    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(400, "Job not found");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(400, "User not found with provided userId");


    const proposal = await Proposal.create({
        job: job._id,
        user: user._id,
        coverLetter
    });


    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { proposal },
                "Proposal created successfully"
            )
        );
});


export const getAllProposals = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.query.userId || req.body.userId;

    if (!userId) throw new ApiError(401, "userId is required");

    let user;

    try {
        user = await User.findById(userId);
    } catch (error) {
        console.error(error);
        const err = "User Id is not acceptable";

        throw new ApiError(400, err, err, error.stack);
    }

    if (!user) throw new ApiError(400, "User not found with provided userId");

    // INFO: there is also a middleware for this task
    if (user.role !== 'freelancer') throw new ApiError(400, "Only freelancer are allowed");

    const appliedJobs = await Proposal.find({ user: userId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { jobs: appliedJobs },
                "Proposals fetched successfully"
            )
        );
});


export const updateProposals = asyncHandler(async (req, res) => {
    const { jobId, proposalId, userId, coverLetter } = req.body;

    if (!userId) throw new ApiError(401, "userId is required");
    if (!jobId && !proposalId) throw new ApiError(401, "jobId or proposalId is required");
    if (!coverLetter) throw new ApiError(401, "coverLetter is required");

    // validate user
    let user;

    try {
        user = await User.findById(userId);
    } catch (error) {
        console.error(error);
        const err = "User Id is not acceptable";

        throw new ApiError(400, err, err, error.stack);
    }

    if (!user) throw new ApiError(400, "User not found with provided userId");

    // INFO: there is also a middleware for this task
    if (user.role !== 'freelancer') throw new ApiError(400, "Only freelancer are allowed");

    // validate job
    let proposal;

    try {
        if (proposalId) {
            proposal = await Proposal.findByIdAndUpdate(proposalId, { coverLetter }, { new: true, runValidators: true });
        }
        else {
            proposal = await Proposal.findOneAndUpdate({ job: jobId, user: userId }, { coverLetter }, { new: true, runValidators: true });
        }
    } catch (error) {
        console.error(error);
        const err = "Job Id is not acceptable";

        throw new ApiError(400, err, err, error.stack);
    }

    if (!proposal) throw new ApiError(400, "Proposal not found with provided details");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { proposal },
                "Job Proposal updated successfully"
            )
        );
});