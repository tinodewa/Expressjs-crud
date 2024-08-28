app.use(express.json());

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    });

// A Temporary in-memory database until we connect to a real one
let books = [];

//create book
app.post('/books', (req, res) => {
    const book = req.body;
    books.push(book);
    res.send('Book is added to the database');
    });

//get all books
app.get('/books', (req, res) => {
    res.json(books);
    });

//get single book
app.get('/books/:id', (req, res) => {
    res.json(books[req.params.id]);
    });

//update book
app.put('/books/:id', (req, res) => {
    const id = req.params.id;
    const newBook = req.body;
    books[id] = newBook;
    res.send('Book is edited');
    });

//delete book
app.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    delete books[id];
    res.send('Book is deleted');
    });
