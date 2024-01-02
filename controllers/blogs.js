const router = require('express').Router()
const { Blog, User } = require('../models')
const errorHandler = require('../util/errorHandler')

router.get('/', async(request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
})

router.post('/', async(request, response, next) => {
  await Blog.create(request.body)
    .then(blog => {
      return response.status(201).json(blog)
    })
    .catch(error => next(error))
})

router.delete('/:id', async(request, response, next) => {
  await Blog.findByPk(request.params.id)
    .then(blog => {
      blog.destroy()
      return response.status(204).end()
    })
    .catch(error => next(error))
})

router.put('/:id', async(request, response, next) => {
  await Blog.findByPk(request.params.id)
    .then(async blog => {
      blog.likes++
      const blogChanged = await blog.save()
      return response.status(201).json({ likes: blogChanged.likes })
    })
    .catch(error => next(error))
})

router.use(errorHandler)

module.exports = router