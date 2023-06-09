const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const Subject = require("../models/Subject");
const Course = require("../models/Course");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const quizResult = require("../models/quizResult");
const Resource = require("../models/Resource");


const registerStudent = async (req, res) => {
  const { name, email,enrolment, password,phoneno,college,department,semester,cpi } = req.body;
  if (!email || !name || !password ||!phoneno || !college || !department || !semester || !cpi || !enrolment) {
    throw new BadRequestError("Please provide necessary credentials");
  }
  const studentx = await Student.findOne({ email});
  if (studentx) {
    throw new BadRequestError("This Email already Exists");
  }
  if (password.length < 8) {
    throw new BadRequestError("Minimum size of password should be 8");
  }
  req.body.isRegistered = false;
  const student = await Student.create(req.body);
  const token = student.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: student.name, id: student._id }, token });
};

const forgotPasswordStudent = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email");
  }
  const otp = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
  const student = await Student.findOneAndUpdate(
    { email: email },
    { otp: otp },
    { new: true, runValidators: true }
  );
  if (!student) {
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
    subject: "OTP for Resetting Your student App Password ", // Subject line
    text: `Your OTP for resetting the password for student app is ${otp}, please enter this OTP in your student app to reset your password.
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

const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const student = await Student.findOne({ email });
  if (!student) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await student.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = student.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: student.name, id: student._id }, token });
};


const validateOtp = async (req, res) => {
  let { otp } = req.body;
  const { email } = req.params;
  if (!otp) {
    throw new BadRequestError("Please provide otp in the body");
  } else {
    otp = Number(otp);
    const student = await Student.findOne({ email: email });
    if (student.otp !== otp) {
      res.status(StatusCodes.OK).json({ res: "failed", data: "Invalid otp" });
    } else {
      res.status(StatusCodes.OK).json({ res: "success", data: "valid otp" });
    }
  }
};

const updateStudentPassword = async (req, res) => {
  const { email } = req.params;
  var { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  const student = await Student.findOneAndUpdate(
    { email: email },
    { password },
    { new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  if (!student) {
    throw new NotFoundError("student not found");
  } else {
    res.status(StatusCodes.OK).json({ res: "success", data: student });
  }
};

const getSubjects = async(req,res)=>{
  const {userId} = req.user;
  const college_student = await Student.findOne({_id:userId});
  if(!college_student){
    throw new BadRequestError("this student id doesn't exists")
  }
  const college = college_student.college;
  const subjects = await Subject.find({college,department:{$ne:college_student.department}});
  res.status(StatusCodes.OK).json({res:"success",data:subjects})

}
const choiceFill = async(req,res)=>{
  const {choices} = req.body;
  const {userId} = req.user;
  if(!choices){
    throw new BadRequestError("please provide choices");
  }
  const student = await Student.findOneAndUpdate({_id:userId},{choices:choices,isChoiceFilled:true},{new:true});
  res.status(StatusCodes.OK).json({res:"success",data:student});


}
const validateMailOtp = async(req,res)=>{
  let { otp } = req.body;
  const { email } = req.params;
  if (!otp) {
    throw new BadRequestError("Please provide otp in the body");
  } else {
    otp = Number(otp);
    const student = await Student.findOne({ email: email });
    if (student.mailotp !== otp) {
      res.status(StatusCodes.OK).json({ res: "failed", data: "Invalid otp" });
    } else {
      res.status(StatusCodes.OK).json({ res: "success", data: "valid otp" });
    }
  }
}
const sendMailOtp = async(req,res)=>{
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email");
  }
  const otp = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
  const student = await Student.findOneAndUpdate(
    { email: email },
    { mailotp: otp },
    { new: true, runValidators: true }
  );
  if (!student) {
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
    subject: "Email Verification", // Subject line
    text: `Your OTP for email verfication for student app is ${otp}, please enter this OTP in your student app to verify your email.
-Thanks,
CVMU  `, // plaintext body
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }

    res.status(StatusCodes.OK).json({ otpsent: true });
  });
}
const getStudentDetails = async(req,res)=>{
  const {userId} = req.user;
  var student = await Student.findOne({_id:userId});
  if(!student){
    throw new BadRequestError("NO students exists with this id");
  }
  if(student.subject){
    const subject = await Subject.findOne({college:student.college,name:student.subject});
    for(let i=0;i<subject.courses.length;i++){
      if(subject.courses[i].semester == student.semester)
      {
        var course  = await Course.findOne({_id:subject.courses[i].courseId});
        break;
      }
    }
    res.status(StatusCodes.OK).json({res:"success",data:student,course});

  }
  else{
    res.status(StatusCodes.OK).json({res:"success",data:student});
  }
}
const getAllQuizzes = async(req,res)=>{
  const {userId} = req.user;
  const student = await Student.findOne({_id:userId});
  var attended_quiz = await quizResult.find({studentId:userId}).select('quizId');
  var quiz = await Quiz.find({subject:student.subject,college:student.college,semester:student.semester,isExpired:false});
  let result = [];
  for(let i =0;i<quiz.length;i++){
    if(attended_quiz.find((o) => o.quizId == `${quiz[i]._id}`)){
      continue;
    }
    let question_array = [];
    let obj = {};
    obj.name = quiz[i].name;
    obj.duration = quiz[i].duration;
    obj.totalMarks = quiz[i].totalMarks;
    for(let j=0;j<quiz[i].questions.length;j++){
      let question = await Question.findOne({_id:quiz[i].questions[j]});
      if(!question) console.log(quiz[i].questions[j])
      let question_object = {}
      question_object.question = question.question;
      question_object.options = question.options;
      question_object.correctOption = question.correctOption;
      question_object._id = question._id;
      question_object.quizId = question.quizId;
      question_object.marks = question.marks;
      question_object.studentChoice = "-1";
      question_object.imgUrl = question.imgUrl;
      question_array.push(question_object);
    }
    obj.questions = question_array;
    result.push(obj);
  }
  res.status(StatusCodes.OK).json({res:"success",data:result})

}
const getQuiz = async(req,res)=>{
  const {id} = req.params;
  var quiz = await Quiz.findOne({_id:id});
  if(!quiz){
    throw new BadRequestError("Quiz does not exists with this id");
  }
  let obj = {};
  obj.name = quiz.name;
  obj.duration = quiz.duration;
  obj.totalMarks = quiz.totalMarks;
  let question_array = [];
  for (let j = 0; j < quiz.questions.length; j++) {
    const question = await Question({ _id: quiz.questions[j] });
    question_array.push(question);
  }
  obj.questions = question_array;
  res.status(StatusCodes.OK).json({ res: "success", data: obj });

}
const submitQuiz = async(req,res)=>{
  let {questions} = req.body;
  questions = eval(questions);
  const {userId} = req.user;
  var result_object = {}
  var marks = 0;
  var response_array = [];
  for(let i =0;i<questions.length;i++)
  {
    const obj = {}
    obj.questionId = questions[i]._id;
    obj.response= Number(questions[i].studentChoice);
    if(questions[i].correctOption[0] == obj.response){
      marks += questions[i].marks;
    }
    response_array.push(obj);
    result_object.quizId = questions[i].quizId;

  }
  result_object.studentResponse = response_array;
  result_object.studentId = userId;
  result_object.marksObtained = marks;
  const quizresult = await quizResult.create(result_object);
  res.status(StatusCodes.OK).json({res:"success",data:quizresult})
}

const getResources = async(req,res)=>{
  const {userId} = req.user;
  const student = await Student.findOne({_id:userId});
  const {type} = req.query;
  const notifications = await Resource.find({college:student.college,subject:student.subject,semester:student.semester,type}).select(["name","link"]);
  res.status(StatusCodes.OK).json({res:"success",data:notifications})
}

const getAttendedQuizzes = async(req,res)=>{
  const {userId} = req.user;
  const quiz = await quizResult.find({studentId:userId});
  let quiz_array = [];
  for(let i =0;i<quiz.length;i++)
  {
    const obj = {};
    const temp_quiz = await Quiz.findOne({_id:quiz[i].quizId});
    obj.quiz = temp_quiz;
    obj.marksObtained = quiz[i].marksObtained;
    obj.studentResponse = quiz[i].studentResponse;
    quiz_array.push(obj);
  }
  res.status(StatusCodes.OK).json({res:"success",data:quiz_array});
}
const updateDetails = async(req,res)=>{
  const {userId} = req.user;
  const update_student = await Student.findOneAndUpdate({_id:userId},req.body,{new:true,runValidators:true});
  if(!update_student){
    throw new BadRequestError("please provide all the correct details");
  }
  res.status(StatusCodes.OK).json({res:"success",data:update_student});
}



module.exports = {
  registerStudent,
  forgotPasswordStudent,
  loginStudent,
  validateOtp,
  updateStudentPassword,
  choiceFill,
  validateMailOtp,
  sendMailOtp,
  getStudentDetails,
  getQuiz,
  getAllQuizzes,
  getSubjects,
  submitQuiz,
  getResources,
  getAttendedQuizzes,
  updateDetails
};
