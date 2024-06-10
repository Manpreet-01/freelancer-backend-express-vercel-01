const express = require('express');
const app = express();

const path = require('path');


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

app.get('/about', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
});

app.get('/test', function (req, res) {
	res.json({ message: "hello world from express-vercel project." });
});

console.log("hit")

// const port = 8000;
// app.listen(port, () => console.log('Server ready on port ', port));

module.exports = app;
