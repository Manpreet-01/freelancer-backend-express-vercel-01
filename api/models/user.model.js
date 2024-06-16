import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is required"],
    },
    type: {
        enum: {
            values: ['freelancer', 'client'],
            message: "Account type must be 'freelancer' or 'client'"
        },
        type: String,
        requried: true,
    }
});

export const User = mongoose.model('User', userSchema);