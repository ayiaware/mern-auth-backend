const User = require('../models/userModel'); // Importing the User model
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken library for token management

// Function to create a JWT token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' }); // Token expires in 1 day
}

// Login user function
const loginUser = async (req, res) => {
    const { email, password } = req.body; // Extracting email and password from the request body

    try {
        const user = await User.login(email, password); // Attempt to log the user in

        // Create a token for the logged-in user
        const token = createToken(user._id);

        // Store the token in the session
        req.session.userId = user._id;  // Store user ID in the session
        req.session.token = token;      // Store JWT token in the session
        req.session.name = user.name;    // Store user's name in the session

        // Respond with the user's email and the token
        res.status(200).json({ name: user.name, email, token });
    } catch (error) {
        // Handle errors (e.g., incorrect email or password)
        res.status(400).json({ error: error.message });
    }
}

// Signup user function
const signupUser = async (req, res) => {
    const { name, email, password } = req.body; // Extracting user details from the request body

    try {
        const user = await User.signup(name, email, password); // Attempt to sign up the user

        // Create a token for the newly signed-up user
        const token = createToken(user._id);

        // Store user info and token in session
        req.session.userId = user._id;
        req.session.token = token;
        req.session.name = user.name;    // Store user's name in the session

        // Respond with the user's name, email, and the token
        return res.status(200).json({ name, email, token });
    } catch (error) {
        // Handle errors (e.g., validation errors)
        return res.status(400).json({ error: error.message });
    }
}

// Logout user function
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        res.status(200).json({ message: 'Logged out successfully.' });
    });
}

// Exporting the signup, login, and logout functions to be used in routes
module.exports = { signupUser, loginUser, logoutUser };
