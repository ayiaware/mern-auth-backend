const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing
const validator = require('validator'); // Importing validator for input validation

const Schema = mongoose.Schema; // Creating a shortcut for Mongoose's Schema

// Defining the user schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true // Name is a required field
    },
    email: {
        type: String,
        required: true, // Email is a required field
        unique: true // Email must be unique across users
    },
    password: {
        type: String,
        required: true // Password is a required field
    }
});

// Static signup method for creating a new user
userSchema.statics.signup = async function (name, email, password) {
    // Check if all fields are provided
    if (!name || !email || !password) {
        throw Error('All fields are required');
    }

    // Validate the email format
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }

    // Check if the password is strong enough
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }

    // Check if the email already exists
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already in use');
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hash = await bcrypt.hash(password, salt); // Hash the password

    // Create a new user and return it
    const user = await this.create({ name, email, password: hash });
    return user;
}

// Static login method for authenticating a user
userSchema.statics.login = async function (email, password) {
    // Check if all fields are filled
    if (!email || !password) {
        throw Error('All fields are required');
    }

    // Find the user by email
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }

    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }

    // Return the user if login is successful
    return user;
}

// Exporting the User model based on the user schema
module.exports = mongoose.model('User', userSchema);
