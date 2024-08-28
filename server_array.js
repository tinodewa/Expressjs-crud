const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

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
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).send('Missing title or author');
    }

    const newBook = {id: books.length + 1, title, author};
    books.push(newBook);
    res.status(201).json(newBook);
});

//get all books
app.get('/books', (req, res) => {
    res.json(books);
});

//get single book
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).send('Book not found');
    }
    res.json(book);
});

//update book
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).send('Book not found');
    }
    
    const { title, author } = req.body;
    book.title = title || book.title;
    book.author = author || book.author;

    res.send(book);
});

//delete book
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
        return res.status(404).send('Book not found');
    }

    books.splice(bookIndex, 1);
    res.status(204).send();
});
