const express = require("express");
const router = express.Router();

const {
 loginFaculty,
 validateMailOtp,
 forgotPasswordFaculty,
 updateFacultyPassword,
 getAllQuizzes,
 getQuiz,
 createQuiz,
 createQuestion
} = require("../controllers/Faculty");
const authMiddleware = require("../middleware/authentication_faculty");

//authentication
router.route("/login").post(loginFaculty);
router.route("/otp/validate/:email").post(validateMailOtp);
router.route("/forgotpassword").patch(forgotPasswordFaculty);
router.route("/password/:email").patch(updateFacultyPassword);

//quiz
router.route("/quiz").get(authMiddleware,getAllQuizzes);
router.route("/quiz/:id").get(authMiddleware,getQuiz);//quiz/quizid
router.route("/quiz").post(authMiddleware,createQuiz);//just create the quiz without questions
router.route("/quiz/question").post(authMiddleware,createQuestion);//then add question one by one

module.exports = router;
