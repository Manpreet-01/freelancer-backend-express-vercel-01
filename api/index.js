import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cookieParser from "cookie-parser"
import cors from "cors";
import { connectDB } from "./db.js";
import { userRouter } from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { jobRouter } from "./routes/job.routes.js";
import { proposalRouter } from "./routes/proposal.routes.js";

const PORT = process.env.PORT || 8000;
const app = express();


app.use(express.json({ limit: "1kb" }));
app.use(express.urlencoded({ extended: true, limit: "1kb" }));
app.use(cookieParser())

app.use(
	cors({
		origin:
			process.env.CORS_ORIGIN === "*"
				? "*" // This might give CORS error for some origins due to credentials set to true
				: process.env.CORS_ORIGIN?.split(","), // For multiple cors origin for production. Refer https://github.com/hiteshchoudhary/apihub/blob/a846abd7a0795054f48c7eb3e71f3af36478fa96/.env.sample#L12C1-L12C12
		credentials: true,
	})
);



app.get('/', (req, res) => {
	res.json({ res: PORT, msg: 'Server is OK' });
});


app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/proposal", proposalRouter);

connectDB();

app.use(errorHandler);

// app.use()
app.listen(PORT, () => console.log('Server ready on port ', PORT));

export default app;
