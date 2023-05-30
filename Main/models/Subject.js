const mongoose = require("mongoose");


const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    unique:true
  },
  faculty:{
    type:String,
    required:[true,"please provide faculty's name"]
  },
  college:{
    type:String,
    required:[true,"please provide college name"],
    default:"GCET",
    enum:["GCET","ADIT","MBIT"]
  },
  department:{
    type:String,
    required:[true,"please provide department name"]
  },
  seats:{
    type:Number,
    default:30,
    required:[true,"please provide maximum seats available"],
  },
  currentSeats:{
    type:Number,
    default:0,
    min:0
  }

});


module.exports = mongoose.model("Subject", SubjectSchema);
