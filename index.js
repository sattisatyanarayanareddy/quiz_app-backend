const express = require('express');
const mongoose = require('mongoose');
const QuizData = require('./model'); // Updated model import
const cors = require('cors'); // Import CORS

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for cross-origin requests
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://satyaS:Satya123456@cluster0.rwedk5w.mongodb.net/QuizDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected..."))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure if connection fails
    });

// POST request to add quiz data
app.post('/postquizData', async (req, res) => {
    const { QuestionID, QuestionText, Options, CorrectAnswer, Category, Difficulty } = req.body;

    try {
        // Check if the QuestionID already exists
        const existingQuestion = await QuizData.findOne({ QuestionID });
        if (existingQuestion) {
            return res.status(400).json({ message: 'QuestionID already exists' });
        }

        // Create new quiz data
        const newQuizData = new QuizData({
            QuestionID,
            QuestionText,
            Options,
            CorrectAnswer,
            Category,
            Difficulty
        });

        // Save the new question to the database
        const savedQuizData = await newQuizData.save();
        res.status(201).json(savedQuizData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET request to fetch quiz data by QuestionID
app.get('/getquizData', async (req, res) => {
    const { QuestionID } = req.query;

    try {
        if (QuestionID) {
            const quizData = await QuizData.findOne({ QuestionID });
            if (!quizData) {
                return res.status(404).json({ message: 'Question not found' });
            }
            return res.json(quizData);
        } else {
            const allQuizData = await QuizData.find({});
            return res.json(allQuizData);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Define the PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
