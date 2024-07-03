import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Proposal } from "../models/proposal.model";
import { Job } from "../models/job.model";
import { User } from "../models/user.model";


export const createProposal = asyncHandler(async (req, res) => {
    const { jobId, coverLetter } = req.body;
    const { user } = req;
    if (!user) throw new ApiError(400, "req.user is falsy. middleware buggy or absent");

    // TODO: Improve logic for validations and add also for data-types
    if (!jobId) throw new ApiError(401, "jobId is required");
    if (!coverLetter) throw new ApiError(401, "coverLetter is required");

    const existingProposal = await Proposal.findOne({ job: jobId, user: user._id });
    if (existingProposal) throw new ApiError(401, "You already apply for this job.");

    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(400, "Job not found");


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
    const { user } = req;
    if (!user) throw new ApiError(400, "req.user is falsy. middleware buggy or absent");

    const appliedJobs = await Proposal.find({ user: user._id });

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
    const { proposalId, jobId, coverLetter } = req.body;
    const { user } = req;
    if (!user) throw new ApiError(400, "req.user is falsy. middleware buggy or absent");

    if (!jobId && !proposalId) throw new ApiError(401, "jobId or proposalId is required");
    if (!coverLetter) throw new ApiError(401, "coverLetter is required");

    // validate job
    let proposal;

    try {
        if (proposalId) {
            proposal = await Proposal.findByIdAndUpdate(proposalId, { coverLetter }, { new: true, runValidators: true });
        }
        else {
            proposal = await Proposal.findOneAndUpdate({ job: jobId, user: user._id.toString() }, { coverLetter }, { new: true, runValidators: true });
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