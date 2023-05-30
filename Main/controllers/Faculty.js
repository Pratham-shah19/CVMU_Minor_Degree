const Admin = require("../models/Admin");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const Subject = require("../models/Subject");
const Faculty = require("../models/Faculty");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const forgotPasswordFaculty = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email");
  }
  const otp = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
  const faculty = await Faculty.findOneAndUpdate(
    { email: email },
    { mailotp: otp },
    { new: true, runValidators: true }
  );
  if (!faculty) {
    throw new BadRequestError("Please provide valid email");
  }


  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: "cvmuminordegree@gmail.com",
      pass: "viekdygkymatxtlz",
    },
  });

  const mailOptions = {
    from: '"CVMU Minor Degree " <cvmuminordegree@gmail.com>', // sender address (who sends)
    to: `${email}`, // list of receivers (who receives)
    subject: "OTP for Resetting Your Faculty Password ", // Subject line
    text: `Your OTP for resetting the password for Faculty portal is ${otp}, please enter this OTP in your Faculty portal to reset your password.
-Thanks,
CVMU  `, // plaintext body
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }

    res.status(StatusCodes.OK).json({ otpsent: true });
  });
};

const loginFaculty = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const faculty = await faculty.findOne({ email });
  if (!faculty) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await faculty.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = faculty.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: faculty.name, id: faculty._id }, token });
};


const validateMailOtp = async (req, res) => {
  let { otp } = req.body;
  const { email } = req.params;
  if (!otp) {
    throw new BadRequestError("Please provide otp in the body");
  } else {
    otp = Number(otp);
    const faculty = await Faculty.findOne({ email: email });
    if (faculty.mailotp !== otp) {
      res.status(StatusCodes.OK).json({ res: "failed", data: "Invalid otp" });
    } else {
      res.status(StatusCodes.OK).json({ res: "success", data: "valid otp" });
    }
  }
};

const updateFacultyPassword = async (req, res) => {
  const { email } = req.params;
  var { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  const faculty = await Faculty.findOneAndUpdate(
    { email: email },
    { password },
    { new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  if (!faculty) {
    throw new NotFoundError("student not found");
  } else {
    res.status(StatusCodes.OK).json({ res: "success", data: faculty });
  }
};

const getAllQuizzes = async(req,res)=>{
  const {subject,sem} = req.params;
  var query_object= {};
  if(subject){
    query_object.subject = subject;
  }
  if(sem){
    query_object.semester = sem;
  }
  var quiz = await Quiz.find(query_object);
  
  for(let i =0;i<quiz.length;i++){
    let question_array = [];
    for(let j=0;j<quiz[i].questions.length;j++){
      const question = await Question({_id:quiz[i].questions[j]});
      question_array.push(question);
    }
    quiz[i].questions = question_array;
  }

  res.status(StatusCodes.OK).json({res:"success",data:quiz})

}
const getQuiz = async(req,res)=>{
  const {id} = req.params;
  var quiz = await Quiz.findOne({_id:id});
  if(!quiz){
    throw new BadRequestError("Quiz does not exists with this id");
  }
  let question_array = [];
  for(let j=0;j<quiz.questions.length;j++){
    const question = await Question({_id:quiz.questions[j]});
    question_array.push(question);
  }
  quiz.questions = question_array;
  res.status(StatusCodes.OK).json({res:"success",data:quiz});

}
const createQuiz = async(req,res)=>{

  res.send('hh')
}
const createQuestion = async(req,res)=>{
  res.send('hh')

}

module.exports = {
  forgotPasswordFaculty,
  loginFaculty,
  updateFacultyPassword,
  validateMailOtp,
  getAllQuizzes,
  createQuiz,
  getQuiz,
  createQuestion

};
