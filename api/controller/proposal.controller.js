import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Proposal } from "../models/proposal.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";


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

    await user.appliedJobs.push(job._id);
    await user.save();

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

    const proposals = await Proposal.find({ user: user._id });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { proposals },
                "Proposals fetched successfully"
            )
        );
});

export const getProposalById = asyncHandler(async (req, res) => {
    const proposalId = req.params.proposalId || req.query.proposalId || req.body.proposalId;
    if (!proposalId) throw new ApiError(401, "proposalId is required");

    const { user } = req;
    if (!user) throw new ApiError(400, "req.user is falsy. middleware buggy or absent");

    // validate job
    let proposal;

    try {
        proposal = await Proposal.findById(proposalId);
    } catch (error) {
        console.error(error);
        const err = "proposal Id is not acceptable";

        throw new ApiError(400, err, err, error.stack);
    }

    if (!proposal) throw new ApiError(400, "Proposal not found with provided details");

    const isAccessDenied = proposal.user.toString() !== user._id.toString();
    if (isAccessDenied) throw new ApiError(400, "Access Denied");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { proposal },
                "Job Proposal fetched successfully"
            )
        );
});


export const getProposal = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId || req.query.jobId || req.body.jobId;
    if (!jobId) throw new ApiError(401, "jobId is required");

    const { user } = req;
    if (!user) throw new ApiError(400, "req.user is falsy. middleware buggy or absent");

    // validate job
    let proposal;

    try {
        proposal = await Proposal.findOne({ job: jobId, user: user._id });
    } catch (error) {
        console.error(error);
        const err = "job Id is not acceptable";
        throw new ApiError(400, err, err, error.stack);
    }

    if (!proposal) throw new ApiError(400, "Proposal not found with provided details");
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { proposal },
                "Job Proposal fetched successfully"
            )
        );
});

export const updateProposals = asyncHandler(async (req, res) => {
    const { jobId, coverLetter } = req.body;
    const { user } = req;
    if (!user) throw new ApiError(400, "req.user is falsy. middleware buggy or absent");

    if (!jobId) throw new ApiError(401, "jobId is required");
    if (!coverLetter) throw new ApiError(401, "coverLetter is required");

    // validate job
    let proposal;

    try {
        proposal = await Proposal.findOneAndUpdate({ job: jobId, user: user._id.toString() }, { coverLetter }, { new: true, runValidators: true });
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

// ONLY for admins
export const deleteProposal = asyncHandler(async (req, res) => {
    const { jobId } = req.body;
    const { user } = req;
    if (!user) throw new ApiError(400, "req.user is falsy. middleware buggy or absent");
    if (!jobId) throw new ApiError(401, "jobId is required");

    // validate job
    let proposal;

    try {
        proposal = await Proposal.findOneAndDelete({ job: jobId, user: user._id.toString() }, { new: true });
    } catch (error) {
        console.error(error);
        const err = "Invalid data provided";
        throw new ApiError(400, err, err, error.stack);
    }

    if (!proposal) throw new ApiError(400, "Proposal not found with provided details");

    await user.appliedJobs.pull(jobId);
    await user.withdrawnProposals.push(jobId);
    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { proposal },
                "Job Proposal Deleted successfully"
            )
        );
});

export const withdrawProposal = asyncHandler(async (req, res) => {
    const { jobId } = req.body;
    const { user } = req;
    if (!user) throw new ApiError(400, "req.user is falsy. middleware buggy or absent");
    if (!jobId) throw new ApiError(401, "jobId is required");

    // validate job
    let proposal;

    try {
        proposal = await Proposal.findOneAndUpdate(
            { job: jobId, user: user._id.toString() },
            { withdrawn: true },
            { new: true }
        );
    } catch (error) {
        console.error(error);
        const err = "Invalid data provided";
        throw new ApiError(400, err, err, error.stack);
    }

    if (!proposal) throw new ApiError(400, "Proposal not found with provided details");


    if (!user.withdrawnProposals.includes(jobId)) {
        await user.withdrawnProposals.push(jobId);
        await user.save();
    } else {
        console.log("jobId exists in user.withdrawnProposals ", { jobId, user });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { proposal },
                "Job Proposal Deleted successfully"
            )
        );
});

// for clients only
export const acceptOrRejectProposal = asyncHandler(async (req, res) => {
    const { user } = req;
    const proposalId = req.params.proposalId || req.query.proposalId || req.body.proposalId;
    const pStatus = req.params.proposalStatus || req.query.proposalStatus || req.body.proposalStatus;

    if (!pStatus) throw new ApiError(401, "proposalStatus is required");
    if (!['rejected', 'accepted', 'reset'].includes(pStatus)) throw new ApiError(401, "Invalid proposalStatus provided");

    // if (!jobId) throw new ApiError(401, "jobId is required");
    if (!proposalId) throw new ApiError(401, "proposalId is required");

    const isExisted = await Proposal.findById(proposalId).populate("job");
    if (!isExisted || isExisted.job.createdBy.toString() !== user._id.toString()) {
        throw new ApiError(401, "Not allowed");
    }

    // validate
    let proposal;

    try {
        if (pStatus === 'reset') {  // change not neither accepted nor rejected
            proposal = await Proposal.findByIdAndUpdate(proposalId, { status: 'pending' }, { new: true, runValidators: true });
        } else {
            proposal = await Proposal.findByIdAndUpdate(proposalId, { status: pStatus }, { new: true, runValidators: true });
        }
    } catch (error) {
        console.error(error);
        // TODO: pass only validations errors
        const err = error instanceof mongoose.MongooseError ? error.message : "Invalid data provided";
        throw new ApiError(400, err, err, error.stack);
    }

    if (!proposal) throw new ApiError(400, "Proposal not found with provided details");


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { proposal },
                "Proposal status updated successfully"
            )
        );
});