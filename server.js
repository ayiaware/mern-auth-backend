// Load environment variables from the .env file (e.g., MONGO_URI, PORT, SECRET)
require('dotenv').config();

const express = require('express');  // Framework for building the server and handling requests
const mongoose = require('mongoose'); // MongoDB ODM (Object Data Modeling) for interacting with the database
const rateLimit = require('express-rate-limit'); // Middleware to apply rate limiting to prevent abuse
const helmet = require('helmet');  // Security middleware to set HTTP headers and protect against common vulnerabilities
const cors = require('cors');  // Middleware to handle Cross-Origin Resource Sharing (CORS)
const userRoutes = require('./routes/userRoutes'); // Routes for handling user authentication (login, signup)
const logger = require('./logger/logger'); // Import your logger
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Create an Express application
const app = express();

// Use Helmet to enhance API security by setting HTTP headers
app.use(helmet());

// Enable CORS with default settings
app.use(cors({
    origin: 'http://localhost:4000', // Your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
}));

// Middleware to parse incoming JSON requests
app.use(express.json()); // Parse incoming JSON requests

// Apply rate limiting (100 requests per 15 minutes per IP) to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});


// Apply rate limiter middleware to the user routes
app.use('/api/user/login', limiter);
app.use('/api/user/signup', limiter);
app.use('/api/user/logout', limiter);


// Session management configuration
app.use(session({
    secret: process.env.SESSION_SECRET,  // Use a secure secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),  // Store sessions in MongoDB
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,  // 1-day expiration for session cookies
        httpOnly: true,  // Prevent client-side JavaScript from accessing the cookie
        secure: false
        //process.env.NODE_ENV === 'production'  // Ensure cookies are sent over HTTPS
    }
}));


// Define routes
app.use('/api/user', userRoutes); // Register user routes under the /api/user path

// Log each incoming request's method and path for debugging and monitoring
app.use((req, res, next) => {
    console.log('Session:', req.session); // Log session details
    logger.info(`${req.method} ${req.url}`); // Log the method and URL
    next(); // Move to the next middleware or route handler
});


app.get('/', (req, res) => {
    // Check if the user is logged in by checking the session
    if (req.session.userId) {
        res.json({ message: `Welcome to the app, ${req.session.name || 'User'}!` });
    } else {
        res.json({ message: 'Welcome to the app!' }); // Send a welcome message for guests
    }
});


// Handle any uncaught errors and send an appropriate response
app.use((err, req, res, next) => {
    logger.error(err.message); // Log the error message
    const statusCode = res.statusCode ? res.statusCode : 500; // Set status code
    res.status(statusCode).json({ message: err.message }); // Send error response
});

// Get the port from environment variables
const port = process.env.PORT || 3000; // Default to port 3000 if not specified

// Connect to MongoDB and start the server once the database connection is established
const startServer = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            // Listen for incoming requests once connected to the database
            app.listen(port, () => {
                logger.info(`Listening on port ${port}`); // Log when the server starts
            });
        })
        .catch((err) => {
            logger.error(err); // Log connection errors
        });
};

// Call the startServer function to initiate the server
startServer();

// Export the app and the start function
module.exports = { app, startServer }; // Export the app for testing
