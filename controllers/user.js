const User = require('../models/user')

const users_get = async (req, res) => {
    const allUsers = await User.find({}).populate('blogs')
    res.status(200).json(allUsers)
}

const signup_post = async (req, res) => {
    const { name, username, password } = req.body
    const newUser = await User.signup(name, username, password)
    res.status(201).json(newUser)
}

const login_post = async (req, res) => {
    const { username, password } = req.body
    const user = await User.login(username, password)
    res.status(200).json(user)
}

module.exports = {
    users_get,
    signup_post,
    login_post
}