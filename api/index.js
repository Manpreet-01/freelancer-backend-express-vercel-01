import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { connectDB } from "./db.js";
import { userRouter } from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const PORT = process.env.PORT || 8000;
const app = express();


app.use(express.json({limit: "1kb"}))
app.use(express.urlencoded({extended: true, limit: "1kb"}))


app.get('/', function (req, res) {
	res.json({ res: PORT, msg: 'Server is OK' });
});


app.use("/api/v1/user", userRouter);

connectDB();

app.use(errorHandler);

// app.use()
app.listen(PORT, () => console.log('Server ready on port ', PORT));

export default app;
