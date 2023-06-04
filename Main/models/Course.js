const mongoose = require("mongoose");


const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    unique:true
  },
  faculty:{
    type:String,
    required:[true,"please provide faculty's name"]
  },
  subject:{
    type:String
  }

});


module.exports = mongoose.model("Course", CourseSchema);
