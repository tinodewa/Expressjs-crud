//load environment variables
require('dotenv').config();

// Description: Server with MongoDB database
const express = require('express');
const app = express();
const port = 3000;
const Joi = require('joi');
const helmet = require('helmet');
const mongoose = require('mongoose');
const Book = require('./book');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

//rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

//middleware
app.use(express.json()); //parse json
app.use(helmet()); //secure HTTP headers
app.use(limiter); //rate limiting
app.use(cors()); //enable CORS

//connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

//reate validation schema
function validateBook(book) {
    const schema = Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required()
    });
    return schema.validate(book);
}

//main page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//listen to port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

//create book
app.post('/books', async (req, res) => {
    const { error } = validateBook(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        let book = new Book({ title: req.body.title, author: req.body.author });
        book = await book.save();
        res.send(book);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//get all books
app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.send(books);
});

//get single book
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.json(book);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//update book
app.put('/books/:id', async (req, res) => {
    const { error } = validateBook(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            author: req.body.author
        }, { new: true });
        if (!book) {
            return res.status(404).send('Book not found');
        }

        res.send(book);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//delete book
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndRemove(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.status(204).send();
    } catch (err) {
        res.status(400).send(err.message);
    }
});
