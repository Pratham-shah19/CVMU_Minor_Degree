const Admin = require("../models/Admin");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const nodemailer = require("nodemailer");

const registerAdmin = async (req, res) => {
  const { name, email, password} = req.body;
  if (!email || !name || !password ) {
    throw new BadRequestError("Please provide necessary credentials");
  }
  const adminx = await Admin.findOne({email:req.body.email})
  if(adminx){
    throw new BadRequestError("This Email already Exists");
  }
  if(req.body.password.length<6){
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

module.exports = {
  registerAdmin,
  forgotPasswordAdmin,
  loginAdmin,
};
