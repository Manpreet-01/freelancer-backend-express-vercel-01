import mongoose from "mongoose";


export async function connectDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected!");
    }
    catch (err) {
        console.log("DB connection failed :: ", err.message || err);
        // process.exit(1);
    }
}