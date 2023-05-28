const express = require("express");
const router = express.Router();

const {
 loginFaculty,
 validateMailOtp,
 forgotPasswordFaculty,
 updateFacultyPassword
} = require("../controllers/Faculty");
const authMiddleware = require("../middleware/authentication_user");

//authentication
router.route("/login").post(loginFaculty);
router.route("/otp/validate/:email").post(validateMailOtp);
router.route("/forgotpassword").patch(forgotPasswordFaculty);
router.route("/password/:email").patch(updateFacultyPassword);

//quiz


module.exports = router;
