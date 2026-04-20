// VSCODE EXTENSIONS: Thunder Client, Prettier, vscode-pets, gitlantic, error viewer,
// name: index.js

// installs to run: npm install express

// to run: node index.js

const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

//fix cors
const cors = require('cors');
app.use(cors());

// initialize db
require('./db/database');


// routes
const shelvesRouter = require("./routes/shelves");
app.use('/shelves', shelvesRouter);

const booksRouter = require("./routes/books");
app.use("/books", booksRouter);


// basic health check
app.get("/health", (req,res)=>{
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, ()=>{
    console.log("API is running");
    console.log(`Test the health check at http://localhost:${PORT}/health`);
});
