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
  createCourse,
  registerStudent,
  getStudents,
  getAdminDetails
} = require("../controllers/Admin");
const authMiddleware = require("../middleware/authentication_admin");

//authentication
router.route("/login").post(loginAdmin);
router.route("/register").post(registerAdmin);
router.route("/otp/validate/:email").post(validateMailOtp);
router.route("/forgotpassword").patch(forgotPasswordAdmin);
router.route("/password/:email").patch(updateAdminPassword);

//admin
router.route("/details").get(authMiddleware,getAdminDetails);//admin profile

//students
router.route("/student").get(authMiddleware,getStudents);//will give both registered and unregistered students, registered students are classified on the basis of subject they are alloted
router.route("/student/verify").post(authMiddleware,registerStudent);//req.body = [studentid,studentid...]to register students

//subjects
router.route("/subject").get(authMiddleware,getSubjects);//get all the subjects offered in this college
router.route("/subject").post(authMiddleware, createSubject);// [req.body = {name,department,seats}] *faculty is removed

//faculty
router.route('/faculty').post(authMiddleware,registerFaculty);

//courses
router.route("/:subjectId/course").get(authMiddleware,getCourses);//get the courses available in this subject
router.route("/:subjectId/course").post(authMiddleware,createCourse);//add a course to a certain subject

//choice filling results
router.route("/result").get(authMiddleware, publishResult);// once called all the current seats will get reset

module.exports = router;
