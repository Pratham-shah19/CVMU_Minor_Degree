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
  getSubjects,
  sendMailOtp,
  getStudentDetails,
  getAllQuizzes
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

//subjects for choice filling
router.route("/subject").get(authMiddleware, getSubjects);//this will return subjects that are available to particular departments


//choice filling
router.route("/choicefilling").post(authMiddleware,choiceFill);//req.body = {[subject_name1,subject_name2....]}

//profile
router.route("/details").get(authMiddleware,getStudentDetails);

//quiz
router.route("/quiz").get(authMiddleware,getAllQuizzes);

module.exports = router;
