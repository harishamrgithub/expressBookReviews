const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.hasOwnProperty(username);
}


const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    console.log("username + " - " + password" + users);

    console.log(username + " - " + password);
    if (users[username] && password === users[username].password) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    console.log(username + " - " + password);
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send(`Customer successfully logged in`);
    }
    else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        let review = req.body.review;
        let username = req.session.authorization['username']
        console.log(username);
        if (review) {
            book.reviews[username] = review;
        }

        books[isbn] = book;
        res.send(`Review for book with ISBN ${isbn} updated.`);
    } else {
        res.send("Unable to find book!");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn
    let book = books[isbn];
    let username = req.session.authorization['username']

    delete book['reviews'][username]
    res.status(200).send(`Review for the ISBN ${isbn} posted by the user ${username} has been deleted`)
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;