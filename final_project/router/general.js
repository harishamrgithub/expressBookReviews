const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    // check if username and password are provided
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    // check if username already exists
    if (users[req.body.username]) {
        return res.status(400).json({ message: "Username already exists" });
    }
    // register new user
    users[req.body.username] = {
        password: req.body.password
    };
    return res.status(200).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    if (books.length === 0) {
        return res.status(404).json({ message: "No books available" });
    }
    return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Extract ISBN from request parameters
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Extract author from request parameters
    const author = req.params.author;
    let booksByAuthor = [];
    let bookKeys = Object.keys(books);
    for (let i = 0; i < bookKeys.length; i++) {
        let book = books[bookKeys[i]];
        if (book.author === author) {
            booksByAuthor.push(book);
        }
    }
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "Books by this author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Extract title from request parameters
    const title = req.params.title;
    let booksByTitle = [];
    let bookKeys = Object.keys(books);
    for (let i = 0; i < bookKeys.length; i++) {
        let book = books[bookKeys[i]];
        if (book.title === title) {
            booksByTitle.push(book);
        }
    }
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "Books with this title not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Extract ISBN from request parameters
    const isbn = req.params.isbn;
    let bookReview = books[isbn].reviews;

    if (bookReview) {
        return res.status(200).json({ review: bookReview });
    } else {
        return res.status(404).json({ message: "Review for this book not found" });
    }
});

// Async requests
public_users.get("/books", function (req, res) {
    let promise = new Promise(function (resolve, reject) {
        resolve(res.send(JSON.stringify(books, null, 4)));
    });

    promise.then(() => console.log("Book list has been sent successfully"));
});

public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    let promise = new Promise(function (resolve, reject) {
        if (book) {
            resolve(res.send(JSON.stringify(book, null, 5)));
        }
        else {
            resolve(res.send("Sorry, We couldn't find a book with this ISBN"));
        }
    });

    promise.then(() => console.log("The details of the book with the requested ISBN has been sent successfully "));

});

public_users.get('/author/:author', function (req, res) {
    let promise = new Promise(function (resolve, reject) {
        let author = req.params.author;
        let result = {
            "booksByAuthor": []
        }

        let keys = Object.keys(books);

        for (let key of keys) {
            let book = books[key];
            if (book.author == author) {
                result['booksByAuthor'].push(book)
            }
        }

        resolve(res.send(JSON.stringify(result, null, 5)))
    });

    promise.then(() => console.log("The list of books with the requested Author has been sent successfully"))
});

public_users.get('/title/:title', function (req, res) {
    let promise = new Promise(function (resolve, reject) {
        let title = req.params.title;

        let result = {
            "booksByTitle": []
        }

        let keys = Object.keys(books);

        for (let key of keys) {
            let book = books[key]
            if (book.title == title) {
                result['booksByTitle'].push(book)
            }
        }

        resolve(res.send(JSON.stringify(result, null, 5)));
    });

    promise.then(() => console.log("Books with the requested title has been sent successfully."))
});
module.exports.general = public_users;
