const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { string } = require("joi");
require("dotenv").config();

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  enrolment:{
    type:String,
    required:[true,"please provide enrolment number"],
    unique:true
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength:8
  },
  phoneno:{
    type: String,
    required: [true, "Please provide phone number"],
    default:"9999999999"
  },
  otp:{
    type: Number,
    default: 0,
  },
  mailotp: {
    type: Number,
    default: 0,
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
  semester:{
    type:Number,
    required:[true,"provide semester"],
    default:3,
  },
  cpi:{
    type:mongoose.Decimal128,
    required:[true,"provide cpi of the student"]
  },
  imgUrl:{
    type:String
  },
  subject:{
    type:String,
  },
  isRegistered:{
    type:Boolean,
    default:false
  },
  isChoiceFilled:{
    type:Boolean,
    default:false
  },
  choices:{
    type:[String]
  }
});

StudentSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

StudentSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET_STUDENT,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};
StudentSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Student", StudentSchema);
