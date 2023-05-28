const mongoose = require("mongoose");


const quizResultSchema = new mongoose.Schema({
  marksObtained:{
    type:Number,
    default:0
  },
  studentId:{
    type:mongoose.Types.ObjectId,
    ref:"Student"
  },
  quizId:{
    type:mongoose.Types.ObjectId,
    ref:"Quiz"
  },
  studentResponse:{
    type:[Object]//{question:questionId,response:option index}
  }

});


module.exports = mongoose.model("quizResult", quizResultSchema);
