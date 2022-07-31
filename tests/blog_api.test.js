const supertest = require('supertest')
const blogList = require('./blogList')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const initialBlogs = blogList.slice(0, 3)
const { SECRET } = require('../utils/config')
const jwt = require('jsonwebtoken')
const mongoose =  require('mongoose')
const MAIN_PATH = '/api/blogs/'

const api = supertest(app)
const startingUser = {
    name: "Heath Ledger",
    username: "Joker",
    password: "monsieur"
}

const getToken = async () => {
    const { username, id } = await User.findOne({})
    const token = jwt.sign({ username, id }, SECRET)
    return token
}

beforeEach(async () => {

    await Blog.deleteMany({})
    await User.deleteMany({})
    const { name, username, password } = startingUser
    const user = await User.signup(name, username, password)

    for(let blog of initialBlogs){
        const newBlog = new Blog(blog)
        newBlog.user = user.id
        const returnedBlog = await newBlog.save()
        user.blogs = user.blogs.concat(returnedBlog.id)
        await user.save()
    }


})

describe('when getting all blogs', () => {
    test('gets all blogs', async () => {
        const receivedBlogs = await api
            .get(MAIN_PATH)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(receivedBlogs.body).toHaveLength(initialBlogs.length)
    }, 100000)
    
    test('has the id property', async () => {
        const allBlogs = await api
            .get(MAIN_PATH)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const [ firstBlog ] = allBlogs.body
    
        expect(firstBlog.id).toBeDefined()
    })
})

describe('when posting a blog', () => {
    test('creates a blog post correctly', async () => {
        const token = await getToken()
        const newPost = await api
            .post(MAIN_PATH)
            .set({ 'authorization': `bearer ${token}` })
            .send({ title: 'me', author: 'myself', url: 'and i', likes: 42})
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const allBlogs = await api.get(MAIN_PATH)
        expect(allBlogs.body).toHaveLength(initialBlogs.length + 1)
        
        const urls = allBlogs.body.map(blog => blog.url)
        expect(urls).toContain(newPost.body.url)
    })
    
    test('missing likes default to zero', async () => {
        const token = await getToken()
        const newPost = await api
            .post(MAIN_PATH)
            .set({ 'authorization': `bearer ${token}`})
            .send({ title: 'me', author: 'myself', url: 'and i' })
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        expect(newPost.body.likes).toEqual(0)
    })
    
    test('post fails if title and url are not present', async () => {
        await api
            .post(MAIN_PATH)
            .send({ author: 'myself', likes: 42 })
            .expect(400)
    })

    test('post fails with 401 if token not present', async () => {
        await api
            .post(MAIN_PATH)
            .send({ title: 'me', author: 'myself', url: 'and i', likes: 42 })
            .expect(401)
    })
})

        
test('updating adds 1 to likes', async () => {
    const allBlogs = (await api.get(MAIN_PATH)).body
    const [ firstBlog ] = allBlogs

    const updatedBlog = await api
        .put(`${MAIN_PATH}${firstBlog.id}`)
        .send({ likes: firstBlog.likes + 1 })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    expect(updatedBlog.body.likes).toEqual(firstBlog.likes + 1)
})

test('delete succeeds with status 204', async () => {
    const firstEntry = (await api.get(MAIN_PATH)).body[0]
    const token = await getToken()
    await api
        .delete(`${MAIN_PATH}${firstEntry.id}`)
        .set({ 'authorization': `bearer ${token}`})
        .expect(204)
})

describe('when there is one user in the DB', () => {

    test('creates a new user successfuly', async () => {
        const newUser = {
            name: "Gabriel Stoppa",
            username: "Arquimidio",
            password: "vacas"
        }

        const returnedUser = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(returnedUser.body.username).toEqual(newUser.username)
    })

    test('fails when username already registered', async () => {
        const allUsers = await User.find({})
        const { body: { error } } = await api
            .post('/api/users')
            .send(startingUser)
            .expect(401)

        expect(error).toEqual('Username already in use')
        expect(allUsers.length).toEqual(1)
    })

    test('fails when username or password is too small', async () => {
        const invalidCredentials = {
            name: "le wrong",
            username: "ap",
            password: "bololohaha"
        }

        const { body: { error } } = await api
            .post('/api/users')
            .send(invalidCredentials)
            .expect(401)

        expect(error).toEqual('Username and password have a minimum length of 3')
    })

    test('fails when username or password is lacking', async () => {
        const invalidCredentials = {
            name: "le blank",
            password: "canUCMe"
        }

        const { body: { error }} = await api
            .post('/api/users')
            .send(invalidCredentials)
            .expect(401)

        expect(error).toEqual("Please fill username and password fields")
    })
})

afterAll(() => {
    mongoose.connection.close()
})