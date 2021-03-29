const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

server.get("/", (req, res)=> {
    res.status(200).json({message: "Hello fromSprint Challenge 3!"})
})

module.exports = server;
