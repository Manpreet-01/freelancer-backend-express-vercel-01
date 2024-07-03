import mongoose from "mongoose";


const proposalSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    coverLetter: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true });

export const Proposal = mongoose.model("Proposal", proposalSchema);