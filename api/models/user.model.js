import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
    },
    type: {
        type: String,
        required: true,
        enum: {
            values: ['freelancer', 'client'],
            message: "Account type must be either 'freelancer' or 'client' only"
        },
    }
});

export const User = mongoose.model('User', userSchema);