const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})

blogSchema.set('toJSON', {
  transform: (document, receivedObject) => {
    receivedObject.id = receivedObject._id.toString()
    delete receivedObject._id
    delete receivedObject.__v
  }
})
  
module.exports = mongoose.model('Blog', blogSchema)