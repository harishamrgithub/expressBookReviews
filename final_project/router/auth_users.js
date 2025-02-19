const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    // Check if the username is not empty and is alphanumeric
    if (!username || !/^[a-zA-Z0-9]+$/.test(username)) {
        return false;
    }

    // Additional validation criteria can be added here if needed
    // For example:

    // Check if the username length is within a specific range
    if (username.length < 3 || username.length > 20) {
        return false;
    }

    // Check if the username meets certain character restrictions
    // For example, if you want to allow only letters and digits
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return false;
    }

    // Check against a list of reserved usernames, etc.
    // For example, if you want to disallow certain usernames
    const reservedUsernames = ['admin', 'root', 'superuser'];
    if (reservedUsernames.includes(username.toLowerCase())) {
        return false;
    }

    // If all validation criteria pass, return true
    return true;
}

const authenticatedUser = (username, password) => { //returns boolean
    // Check if username and password are provided
    if (!username || !password) {
        return false;
    }

    // Find the user in the records based on the username
    const user = users.find(user => user.username === username);

    // If user not found, return false
    if (!user) {
        return false;
    }

    // Check if the provided password matches the stored password for the user
    // You should implement proper password hashing and comparison here
    // For demonstration purposes, we are comparing passwords directly (not recommended in production)
    if (user.password === password) {
        return true;
    }

    // If password doesn't match, return false
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user is registered and the provided credentials are correct
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ username: username }, "your_secret_key");

    // Return the token as a response
    return res.status(200).json({ token: token });
    //   return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add the review to the book
    books[isbn].reviews.push(review);

    // Return success message
    return res.status(200).json({ message: "Review added successfully" });
    //   return res.status(300).json({message: "Yet to be implemented"});
});
// Export the router containing registered user routes
module.exports.authenticated = regd_users;
// Export the isValid function to validate usernames
module.exports.isValid = isValid;
// Export the users array to store registered users
module.exports.users = users;
