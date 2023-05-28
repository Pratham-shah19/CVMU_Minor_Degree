const { number } = require("joi");
const mongoose = require("mongoose");


const QuizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  college:{
    type:String,
    required:[true,"please provide college name"],
    default:"GCET",
    enum:["GCET","ADIT","MBIT"]
  },
  semester:{
    type:Number,
    required:[true,'please provide semester']
  },
  subject:{
    type:String,
    required:[true,'please provide subject name']

  },
  duration:{
    type:Number,
    required:[true,'please provide duration in minutes']
  },
  questions:{
    type:[mongoose.Types.ObjectId],
    required:[true,'please provide questions'],
    ref:"Quiz"
  }

});


module.exports = mongoose.model("Quiz", QuizSchema);
