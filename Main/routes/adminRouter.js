const express = require('express')
const router = express.Router()

const {loginOwner,forgotPasswordOwner,registerOwner} = require('../controllers/Admin')

router.route('/login').post(loginOwner)
router.route('/register').post(registerOwner)
router.route('/forgotpassword').patch(forgotPasswordOwner)


module.exports = router