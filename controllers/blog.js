const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

const getAll = async (request, response) => {
    const allBlogs = await Blog.find({}).populate('user')
    response.status(200).json(allBlogs)
}

const getSingle = async (request, response) => {
    const { id } = request.params
    const blog = Blog.findById(id)
    if(blog){
        return response.status(200).json(blog)
    }else{
        return response.status(404).end()
    }
}

const create = async (request, response) => {
    if(!request.body.title && !request.body.url){
      return response.status(400).end()
    }

    const { user } = request
    
    const newBlog = {
        ...request.body,
        user: user.id
    }

    const blog = new Blog(newBlog)
    
    const returnedBlog = await blog.save()
    user.blogs = user.blogs.concat(returnedBlog.id)

    await user.save()

    response.status(201).json(returnedBlog)

}

const update = async (request, response) => {
    const { id } = request.params
    const { body } = request
    const savedUpdatedBlog = await Blog
        .findByIdAndUpdate(
            id,
            { likes: body.likes },
            { new: true, runValidators: true, context: 'query'}
        )
    response.status(200).json(savedUpdatedBlog)
}

const deleteSingle = async (request, response) => {
    const { id } = request.params
    const decodedToken = jwt.verify(request.token, SECRET)

    const { user } = request
    const blog = await Blog.findById(id)

    if(decodedToken.id === blog.user.toString()){
        user.blogs = user.blogs.filter(userBlogId => {
            return userBlogId.toString() !== blog.id.toString()
        })
        await user.save()
        await Blog.findByIdAndRemove(blog.id)
        response.status(204).end()
    }   
}

module.exports = {
    getAll,
    getSingle,
    create,
    update,
    deleteSingle
}