
import { connectDB } from "./db.js";

import dotenv from "dotenv";
dotenv.config();

connectDB();

await new Promise(res => setTimeout(res, 10000))

connectDB();

await new Promise(res => setTimeout(res, 1000))

connectDB();