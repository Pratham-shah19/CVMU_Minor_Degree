const mongoose = require("mongoose");


const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  college:{
    type:String,
    required:[true,"please provide college name"],
    default:"GCET",
    enum:["GCET","ADIT","MBIT"]
  }

});


module.exports = mongoose.model("Department", DepartmentSchema);
