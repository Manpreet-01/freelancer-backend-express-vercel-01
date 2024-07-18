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
    status: {
        type: String,
        required: true,
        default: 'unread',
        enum: {
            values: ['unread', 'pending', 'rejected', 'accepted', 'job cancelled'],
            message: "Invalid Proposal Status, valid values are: unread, pending, rejected or accepted"
        },
    },
    coverLetter: {
        type: String,
        required: true,
        trim: true
    },
    isWithdrawn: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export const Proposal = mongoose.model("Proposal", proposalSchema);