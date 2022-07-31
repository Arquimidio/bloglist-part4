const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
        delete returnedObj.passwordHash
    }
})

userSchema.statics.signup = async function(name, username, password){
    const isDuplicate = await this.findOne({ username })
    const hasMinLength = (data) => data.length >= 3
    if(isDuplicate){
        throw Error("Username already in use")
    }

    if(!username || !password){
        throw Error("Please fill username and password fields")
    }

    if(!hasMinLength(username) || !hasMinLength(password)){
        throw Error("Username and password have a minimum length of 3" )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await this.create({
        name, username, passwordHash
    })
    return newUser
}

userSchema.statics.login = async function(username, password){
    const foundUser = await this.findOne({ username }).populate('blogs')
    const correctPassword = foundUser === null
    ? false
    : await bcrypt.compare(password, foundUser.passwordHash)

    if(!(foundUser && correctPassword)){
        throw new Error('Invalid credentials')
    }
    
    const tokenPayload = {
        username: foundUser.username,
        id: foundUser.id
    }

    const token = jwt.sign(tokenPayload, SECRET)
    delete foundUser._doc.passwordHash
    return { token, ...foundUser._doc }
}

module.exports = mongoose.model('User', userSchema)