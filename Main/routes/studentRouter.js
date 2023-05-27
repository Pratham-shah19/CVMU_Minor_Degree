const express = require('express')
const router = express.Router()

const {loginStudent,registerStudent,forgotPasswordStudent} = require('../controllers/Student')
//authentication
router.route('/login').post(loginStudent)
router.route('/register').post(registerStudent)
router.route('/forgotpassword').patch(forgotPasswordStudent)

module.exports = router