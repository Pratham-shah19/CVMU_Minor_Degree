const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  forgotPasswordAdmin,
  registerAdmin,
  validateMailOtp,
  updateAdminPassword,
  createSubject,
  publishResult,
  registerFaculty,
  getSubjects,
  getCourses,
  createCourse
} = require("../controllers/Admin");
const authMiddleware = require("../middleware/authentication_admin");

//authentication
router.route("/login").post(loginAdmin);
router.route("/register").post(registerAdmin);
router.route("/otp/validate/:email").post(validateMailOtp);
router.route("/forgotpassword").patch(forgotPasswordAdmin);
router.route("/password/:email").patch(updateAdminPassword);

//faculty
router.route('/faculty').post(authMiddleware,registerFaculty);

//subjects
router.route("/subject").get(authMiddleware,getSubjects);
router.route("/subject").post(authMiddleware, createSubject);// [req.body = {name,department,faculty,seats}]

//courses
router.route("/:subjectId/course").get(authMiddleware,getCourses);
router.route("/:subjectId/course").post(authMiddleware,createCourse);

//choice filling results
router.route("/result").get(authMiddleware, publishResult);// once called all the current seats will get reset

module.exports = router;
