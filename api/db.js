import mongoose from "mongoose";


export async function connectDB() {
  const connectionState = mongoose.connection.readyState;

  // TODO: testing purposes only , remove these if conditions later
  if (connectionState === 1) {
    console.log("Already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected!");
    return db;
  }
  catch (err) {
    console.log("DB connection failed :: ", err.message || err);
    // process.exit(1);
  }
}