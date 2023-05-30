const express = require("express");
const router = express.Router();

const {
  loginStudent,
  registerStudent,
  forgotPasswordStudent,
  validateOtp,
  updateStudentPassword,
  choiceFill,
  validateMailOtp,
  sendMailOtp,
  getStudentDetails,
} = require("../controllers/Student");
const  authMiddleware  = require("../middleware/authentication_user");
//authentication
router.route("/login").post(loginStudent);
router.route("/register").post(registerStudent);
router.route("/otp/validate/:email").post(validateOtp);
router.route("/mailotp/validate/:email").post(validateMailOtp);//validate mail otp
router.route("/otp/mail").post(sendMailOtp);//sends otp to mail for verfication
router.route("/forgotpassword").patch(forgotPasswordStudent);
router.route("/password/:email").patch(updateStudentPassword);

//choice filling
router.route("/choicefilling").post(authMiddleware,choiceFill);//req.body = {[subject_name1,subject_name2....]}

//profile
router.route("/details").get(authMiddleware,getStudentDetails);

module.exports = router;
