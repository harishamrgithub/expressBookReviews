const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [];

const isValid = (username) => {
    return users.hasOwnProperty(username);
}

const authenticatedUser = (username, password) => {
    if (users[username] && password === users[username].password) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    let inputusername = req.body.username
    let inputpassword = req.body.password
    try {
        if (authenticatedUser(inputusername, inputpassword)) {
            let token = jwt.sign({ username: inputusername }, "access", { expiresIn: '1h' });
            req.session.authorization = { accessToken: token };
            req.session.username = inputusername;
            return res.status(200).json({ message: "Successfully logged in" });
        } else {
            return res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while trying to log in" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        let review = req.body.review;
        let username = req.session.username;

        if (review) {
            book.reviews[username] = review;
        }

        books[isbn] = book;
        res.send(`Review for book with ISBN ${isbn} updated.`);
    } else {
        res.send("Unable to find book!");
    }
});





// Export the router containing registered user routes
module.exports.authenticated = regd_users;
// Export the isValid function to validate usernames
module.exports.isValid = isValid;
// Export the users array to store registered users
module.exports.users = users;
