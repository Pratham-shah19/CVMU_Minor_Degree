const express = require('express')
const router = express.Router()

const {loginAdmin,forgotPasswordAdmin,registerAdmin,validateMailOtp,updateAdminPassword} = require('../controllers/Admin')

router.route('/login').post(loginAdmin)
router.route('/register').post(registerAdmin)
router.route('/otp/validate/:email').post(validateMailOtp);
router.route('/forgotpassword').patch(forgotPasswordAdmin)
router.route('/password/:email').patch(updateAdminPassword);

module.exports = router