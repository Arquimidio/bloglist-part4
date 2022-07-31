const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { SECRET } = require('../utils/config')


const errorHandler = (error, req, res, next) => {
    console.log(error)
    res.status(401).json({ error: error.message })
}

const getTokenFromRequest = (req, res, next) => {
    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        req.token = authorization.slice(7)
    }else{
        req.token = null
    }

    next()
}

const getUserFromToken = async (req, res, next) => {
    if(req.token){ 
        const decodedToken = jwt.verify(req.token, SECRET)
        if(!decodedToken.id){
            res.status(401).json({ error: 'Invalid or missing token' })
        }

        const user = await User.findById(decodedToken.id)
        req.user = user
    }

    next()
}

module.exports = {
    errorHandler,
    getTokenFromRequest,
    getUserFromToken
}