const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs')


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
  req.body.isRegistered = true;
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

const choiceFill = async(req,res)=>{
  const {choices} = req.body;
  const {id} = req.user;
  if(!choices){
    throw new BadRequestError("please provide choices");
  }
  const student = await Student.findOneAndUpdate({_id:id},{choices},{new:true});
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

module.exports = {
  registerStudent,
  forgotPasswordStudent,
  loginStudent,
  validateOtp,
  updateStudentPassword,
  choiceFill,
  validateMailOtp,
  sendMailOtp
};
