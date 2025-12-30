require('dotenv').config();
const express = require('express');
const path = require('path');
const router = require('./routes/url');
const {connectToMongoDB} = require('./connect');
const URL = require('./models/url');
const staticRouter = require('./routes/staticRouter');
const app = express();
const PORT = process.env.PORT || 7001;
const MONGO_URI = process.env.MONGO_URI;

//middleware
app.use(express.json());
app.get('/test', async(req, res) => {
    const allURLS = await URL.find({});
    // return res.end(`
    //     <html>
    //     <head> 
    //         <body> 
    //         <ol> 
    //            ${allURLS.map(url => `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`).join("")};
    //         </ol>
    //         </body>
    //     </head>
    //     </html>       
        
        // `)
    return res.render('home', {
        urls: allURLS,
    });
})

connectToMongoDB(MONGO_URI)
.then(() => console.log("Mongodb Connected"))
.catch((err) => console.log("Database Connection Error:", err.message))
app.listen(PORT, () =>  {
    console.log(`Server started at PORT: ${PORT}`);
})

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// route

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', staticRouter);

app.use('/url', router);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push: {
                visitHistory: new Date(Date.now()),
            },
        }
    );
    res.redirect(entry.redirectURL);
})


// Assignment Questions
// Lab Assignment 1 – Question 1

// Q1:
// Create a new Node.js project named ssr-lab. Initialize it with npm and install Express and EJS.

// Tasks:

// Initialize npm.

// Install required packages.

// Set up a basic server in server.js that listens on port 3000.

// Question:
// Write the commands you would use to do steps 1 and 2.

// What are your commands?

// Commands
// Step 1: Initialize npm

// npm init -y

// This creates a package.json with default settings.

// Step 2: Install packages

// npm install express ejs

// Step 3: Add start script in package.json (optional but recommended)
// "scripts": {
//   "start": "node server.js"
// }

// Now you can start the server with:

// npm start

// ✅ This is the standard lab way to initialize a Node + EJS project.

// Lab Assignment 1 – Question 2

// Create a server.js file and set up an Express server that:

// Uses EJS as the view engine.

// Listens on port 3000.

// Responds with "Home Page" when visiting /.

// Question:
// Write the server.js code to do this.