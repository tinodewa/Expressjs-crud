const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const mongoose = require('mongoose');
const mongoUri = "mongodb+srv://TinoAnggara:dt2zQKx4Z3R0dZP5@clustermain.caawc.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMain";
const Book = require('./book');

//connect to MongoDB
mongoose.connect(mongoUri, {useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

//create app
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//listen to port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

//create book
app.post('/books', async (req, res) => {
    let book = new Book({ title: req.body.title, author: req.body.author });
    book = await book.save();
    res.send(book);
});

//get all books
app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.send(books);
});

//get single book
app.get('/books/:id', async (req, res) => {
    const book =  await Book.findById(req.params.id);
    if (!book) {
        return res.status(404).send('Book not found');
    }
    res.json(book);
});

//update book
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        author: req.body.author
    }, { new: true });
    if (!book) {
        return res.status(404).send('Book not found');
    }

    res.send(book);
});

//delete book
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByIdAndRemove(req.params.id);
    if (!book) {
        return res.status(404).send('Book not found');
    }
    res.status(204).send();
});
