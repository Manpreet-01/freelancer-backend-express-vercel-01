import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    categories: [{
        type: String,       // TODO: create a model and use ref for this field
        trim: true,
        required: true,
    }],
    tags: [{
        type: String,       // TODO: create a model and use ref for this field
        trim: true,
        required: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cancelled: {
        type: Boolean,
        default: false,
    },
    proposals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
        required: true
    }],
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);