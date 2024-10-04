const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  QuestionID: { type: String, required: true, unique: true },
  QuestionText: { type: String, required: true },
  Options: { type: [String], required: true },
  CorrectAnswer: { type: String, required: true },
  Category: { type: String, required: true },
  Difficulty: { type: String, required: true }
});

const QuizData = mongoose.model('QuizData', quizSchema);

module.exports = QuizData;
