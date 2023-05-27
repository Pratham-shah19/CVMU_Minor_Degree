const express = require('express')
const router = express.Router()

const {loginAdmin,forgotPasswordAdmin,registerAdmin} = require('../controllers/Admin')

router.route('/login').post(loginAdmin)
router.route('/register').post(registerAdmin)
router.route('/forgotpassword').patch(forgotPasswordAdmin)


module.exports = router