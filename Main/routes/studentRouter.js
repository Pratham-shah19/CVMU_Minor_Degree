const express = require("express");
const router = express.Router();

const {
  loginStudent,
  registerStudent,
  forgotPasswordStudent,
  validateMailOtp,
  updateStudentPassword,
  choiceFill
} = require("../controllers/Student");
const { authMiddleware } = require("../middleware/authentication_user");
//authentication
router.route("/login").post(loginStudent);
router.route("/register").post(registerStudent);
router.route("/otp/validate/:email").post(validateMailOtp);
router.route("/forgotpassword").patch(forgotPasswordStudent);
router.route("/password/:email").patch(updateStudentPassword);

//choice filling
router.route("/choicefilling").post(choiceFill);

module.exports = router;
