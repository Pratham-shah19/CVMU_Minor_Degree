const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "please provide the question"],
  },
  imgUrl: {
    type: String,
    default:""
  },
  marks: {
    type: Number,
    required: [true, "please provide the marks"],
  },
  quizId: {
    type: mongoose.Types.ObjectId,
    required: [true, "please provide the quiz id"],
  },
  options: {
    type: [Object], //{option:something,imgUrl:?},
    required: [true, "please provide options"],
  },
  correctOption: {
    type: [Number], //index of the correct option
    required: [true, "please provide the correct option"],
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
