import dotenv from "dotenv";
dotenv.config();

import express from 'express';
const app = express();

app.get('/', function (req, res) {
	res.json({ res: process.env.PORT, msg: 'OK' });
});

// const port = 8000;
// app.listen(port, () => console.log('Server ready on port ', port));

export default app;
