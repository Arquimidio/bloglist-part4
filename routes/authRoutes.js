const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.route('/')
    .get(userController.users_get)
    .post(userController.signup_post)

router.route('/login')
    .post(userController.login_post)

module.exports = router