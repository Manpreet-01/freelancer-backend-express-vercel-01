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
    category: [{
        type: String,
        trim: true,
        required: true,
    }],
    tags: [{
        type: String,
        trim: true,
        required: true
    }],
    createdBy: {
        type: String,
        trim: true,
        required: true,
    },
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);