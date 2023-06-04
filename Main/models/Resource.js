const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    unique:true
  },
  college:{
    type:String,
    required:[true,"please provide college name"],
    default:"GCET",
    enum:["GCET","ADIT","MBIT"]
  },
  subject:{
    type:String,
  },
  semester:{
    type:Number
  },
  type:{
    type:String,
    enum:["Announcement","Material","Result"]
  },
  link:{
    type:String
  }

});


module.exports = mongoose.model("Resource", ResourceSchema);
