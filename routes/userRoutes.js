const express = require('express'); // Importing the Express framework
const { signupUser, loginUser, logoutUser } = require('../controllers/userControllers'); // Importing controller functions
const { body, validationResult } = require('express-validator');

const router = express.Router(); // Creating an Express router instance

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Login route: Handles POST requests to /login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    handleValidationErrors,  // Check for validation errors
    loginUser
);

// Signup route: Handles POST requests to /signup
router.post(
    '/signup',
    [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    handleValidationErrors,  // Check for validation errors
    signupUser
);

// Logout route: Handles POST requests to /logout
router.post('/logout', logoutUser);

// Exporting the router to be used in the main application
module.exports = router;
