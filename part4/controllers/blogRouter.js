const blogRouter = require('express').Router()
const Blog = require('../models/blogs.js')
const User = require('../models/users.js')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger.js')

const decodeToken = (request) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    return decodedToken
  }
  catch (error) {
    logger.error(error.message)
    return
  }
}

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  console.log(blog)
  if (blog) response.json(blog)
  else response.status(404).send({ message: `blog with ${id} not found` })
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const {title,author,url,likes,userId}= request.body
  const user = User.findById(userId)
    const updatedBlog = await Blog.findByIdAndUpdate(id, {title,author,url,likes,user:user._id}, { new: true })
    response.status(201).json(updatedBlog)
})

blogRouter.post('/', async (request, response) => {
  const { title, url, author, likes } = request.body

  const decodedToken = decodeToken(request)
  if (!decodedToken) {
    return response.status(401).json({ error: 'invalid Token' })
  }
  const user = await User.findById(request.user)
  const blog = new Blog({ title: title, url: url, author: author, likes: likes, user: user._id })
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)

})



blogRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  response.status(201).send()
})

blogRouter.delete('/all', async (request, response) => {
  await Blog.deleteMany({})
  response.status(201).send()
})


blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const decodedToken = decodeToken(request)
  if (!decodedToken) {
    return response.status(401).json({ error: 'invalid Token' })
  }
  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(400).json({ error: 'no blog with this id' })
    }
    if (blog.user.toString() === request.user) {
      await Blog.findByIdAndDelete(id)
      return response.status(201).send({ message: 'blog deleted' })
    }
    else {
      return response.status(401).send({message:"only the creator of a blog can delete its entry!"})
    }
  }
  catch (e) {
    return response.status(400).json({ error: e.message })

  }
})



module.exports = blogRouter