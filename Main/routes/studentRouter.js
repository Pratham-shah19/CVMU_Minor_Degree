const express = require('express')
const router = express.Router()

const {loginUser,registerUser,forgotPasswordUser} = require('../controllers/Student')

router.route('/login').post(loginUser)
router.route('/register').post(registerUser)
router.route('/forgotpassword').patch(forgotPasswordUser)

module.exports = router