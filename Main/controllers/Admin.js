const express = require("express");
const Owner = require("../models/Owner");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// const stripe = require("stripe")(
//   "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"
// );

const registerOwner = async (req, res) => {
  const { name, email, password} = req.body;
  if (!email || !name || !password ) {
    throw new BadRequestError("Please provide necessary credentials");
  }
  const ownerx = await Owner.findOne({email:req.body.email})
  if(ownerx){
    throw new BadRequestError("This Email already Exists");
  }
  if(req.body.password.length<6){
    throw new BadRequestError("Minimum size of password should be 6");
  }
  // const customer = await stripe.customers.create({
  //   email:email,name:name
  // });
  // req.body.customerId = customer.id;
  const owner = await Owner.create(req.body);
  const token = owner.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: owner.name, id: owner._id }, token });
};

const forgotPasswordOwner = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email");
  }
  const otp = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
  console.log(otp);
  const owner = await Owner.findOneAndUpdate(
    { email: email },
    { mailotp: otp },
    { new: true, runValidators: true }
  );
  if (!owner) {
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
      user: "hetpatel5542@gmail.com",
      pass: "xivslyvrfcrgewtb",
    },
  });

  const mailOptions = {
    from: '"Nivaas " <hetpatel5542@gmail.com>', // sender address (who sends)
    to: `${email}`, // list of receivers (who receives)
    subject: "OTP for Reseting Your User App Password ", // Subject line
    text: `Your OTP for reseting the password for Owner app is ${otp}, please enter this OTP in your User app to reset your password.
-Thanks,
Team Nivaas  `, // plaintext body
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }

    res.status(StatusCodes.OK).json({ otpsent: true });
  });
};

const loginOwner = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const owner = await Owner.findOne({ email });
  if (!owner) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await owner.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = owner.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: owner.name, id: owner._id }, token });
};

module.exports = {
  registerOwner,
  forgotPasswordOwner,
  loginOwner,
};
