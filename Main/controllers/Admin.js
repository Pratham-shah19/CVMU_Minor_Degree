const Admin = require("../models/Admin");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const Subject = require("../models/Subject");
const Faculty = require("../models/Faculty");
const Student = require("../models/Student");
const Course = require("../models/Course");

const registerAdmin = async (req, res) => {
  const { name, email, password,college, phoneno} = req.body;
  if (!email || !name || !password ||!college ||!phoneno) {
    throw new BadRequestError("Please provide necessary credentials");
  }
  const adminx = await Admin.findOne({email})
  if(adminx){
    throw new BadRequestError("This Email already Exists");
  }
  if(password.length<6){
    throw new BadRequestError("Minimum size of password should be 6");
  }

  const admin = await Admin.create(req.body);
  const token = admin.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: admin.name, id: admin._id }, token });
};

const forgotPasswordAdmin = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email");
  }
  const otp = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
  const admin = await Admin.findOneAndUpdate(
    { email: email },
    { mailotp: otp },
    { new: true, runValidators: true }
  );
  if (!admin) {
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
    subject: "OTP for Resetting Your Admin Password ", // Subject line
    text: `Your OTP for resetting the password for Admin portal is ${otp}, please enter this OTP in your Admin portal to reset your password.
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

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = admin.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: admin.name, id: admin._id }, token });
};


const validateMailOtp = async (req, res) => {
  let { otp } = req.body;
  const { email } = req.params;
  if (!otp) {
    throw new BadRequestError("Please provide otp in the body");
  } else {
    otp = Number(otp);
    const admin = await Admin.findOne({ email: email });
    if (admin.mailotp !== otp) {
      res.status(StatusCodes.OK).json({ res: "failed", data: "Invalid otp" });
    } else {
      res.status(StatusCodes.OK).json({ res: "success", data: "valid otp" });
    }
  }
};

const updateAdminPassword = async (req, res) => {
  const { email } = req.params;
  var { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  const admin = await Admin.findOneAndUpdate(
    { email: email },
    { password },
    { new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  if (!admin) {
    throw new NotFoundError("student not found");
  } else {
    res.status(StatusCodes.OK).json({ res: "success", data: admin });
  }
};

const getSubjects = async(req,res)=>{
  const {userId}  = req.user;
  const admin = await Admin.findOne({_id:userId});
  const subjects = await Subject.find({college:admin.college});
  res.status(StatusCodes.OK).json({res:"success",data:subjects}) 
}

const createSubject = async(req,res)=>{
  const {userId} = req.user;
  const {name,department,seats} = req.body;

  const college_admin = await Admin.findOne({_id:userId});
  if(!college_admin){
    throw new BadRequestError("this admin id doesn't exists")
  }
  const college = college_admin.college;

  if(!name ||!department ||!seats){
    throw new BadRequestError("Provide all the necessary subject details")
  }
  req.body.college = college;
  req.body.currentSeats = seats;
  const subject = await Subject.create(req.body);
  res.status(StatusCodes.CREATED).json({res:"success",data:subject})

}
const publishResult = async(req,res)=>{
  const {userId} = req.user;
  var flag = false;
  const college_admin = await Admin.findOne({_id:userId});
  if(!college_admin){
    throw new BadRequestError("this admin id doesn't exists")
  }
  const college = college_admin.college;

  const students = await Student.find({college,subject:{$exists:false}}).sort({cpi:-1});
  for(let i=0;i<students.length;i++){
    const choices = students[i].choices;
    for(let sub in choices){
      const subject = await Subject.findOne({name:choices[sub]});
      if(subject.currentSeats>0){
        const update_student = await Student.findOneAndUpdate({_id:students[i]._id},{subject:subject.name},{new:true});
        const update_subject = await Subject.findOneAndUpdate({name:subject.name},{currentSeats:subject.currentSeats-1},{new:true});
        flag = true;
        break;
      }
    }
  }

  //reset the current seats back to original seats
  const subjects = await Subject.find({});
  for(let i=0;i<subjects.length;i++){
    const update_subject = await Subject.findOneAndUpdate({_id:subjects[i]._id},{currentSeats:subjects[i].seats});
  }
  res.status(StatusCodes.OK).json({res:"success",data:"Result published"})

}
const registerFaculty = async(req,res)=>{
  const {userId} = req.user;
  const {name,email,password,department,subject} = req.body;

  const college_admin = await Admin.findOne({_id:userId});
  if(!college_admin){
    throw new BadRequestError("this admin id doesn't exists");
  }
  const college = college_admin.college;

  if(!name||!email||!password||!department||!subject){
    throw new BadRequestError("Provide the necessary faculty details");
  }
  const facultyx = await Faculty.findOne({email})
  if(facultyx){
    throw new BadRequestError("This Email already Exists");
  }
  if(password.length<6){
    throw new BadRequestError("Minimum size of password should be 6");
  }
  req.body.college = college;
  const faculty = await Faculty.create(req.body);
  res.status(StatusCodes.CREATED).json({res:"success",data:faculty});
}

const getCourses = async(req,res)=>{
  const {subjectId} = req.params;
  const subject = await Subject.findOne({_id:subjectId});
  let courses_array = [];
  for(let i=0;i<subject.courses.length;i++){
    let obj = {};
    obj.semester = subject.courses[i].semester;
    const course = await Course.findOne({_id:subject.courses[i].courseId});
    obj.course = course;
    courses_array.push(obj);
  } 
  res.status(StatusCodes.OK).json({res:"success",data:courses_array});
}

const createCourse = async(req,res)=>{
  const {subjectId} = req.params;
  const {faculty,name} = req.body;
  if(!faculty||!name){
    throw new BadRequestError("please provide both faculty name and name of the course");
  }
  const subject = await Subject.findOne({_id:subjectId});
  let courses = subject.courses;
  req.body.subject = subject.name;
  const course = await Course.create(req.body);
  let obj = {semester:courses.length+3,courseId:course._id};
  courses.push(obj);
  const update_subject = await Subject.findOneAndUpdate({_id:subjectId},{courses},{new:true});

  res.status(StatusCodes.OK).json({res:"success",data:update_subject})

}

const registerStudent = async(req,res)=>{
  const {students} = req.body;
  if(!students){
    throw new BadRequestError("please provide the students array");
  }
  for(let i=0;i<students.length;i++)
  {
    const update_student = await Student.findOneAndUpdate({_id:students[i]},{isRegistered:true});
  } 
  res.status(StatusCodes.OK).json({res:"success"})
}

const getStudents = async(req,res)=>{
  const {userId} = req.user;
  const admin = await Admin.findOne({_id:userId});
  var students_registered = await Student.find({college:admin.college,isRegistered:true});
  var students_unregistered = await Student.find({college:admin.college,isRegistered:false});
  var groupby = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  var registered = groupby(students_registered,"subject");
  res.status(StatusCodes.OK).json({res:"success",data:{registered,unregistered:students_unregistered}});
}

const getAdminDetails = async(req,res)=>{
  const {userId} = req.user;
  const admin = await Admin.findOne({_id:userId});
  res.status(StatusCodes.OK).json({res:"success",data:admin});
}

module.exports = {
  registerAdmin,
  forgotPasswordAdmin,
  loginAdmin,
  updateAdminPassword,
  validateMailOtp,
  createSubject,
  publishResult,
  registerFaculty,
  getSubjects,
  getCourses,
  createCourse,
  getStudents,
  registerStudent,
  getAdminDetails
};
