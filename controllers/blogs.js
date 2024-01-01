const router = require('express').Router()
const Blog = require('../models')

router.get('/', async(request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
})

router.post('/', async(request, response) => {
  try {
    const blog = await Blog.create(request.body)
    return response.status(201).json(blog)
  } catch (e) {
    console.log('Blog save error: ' + e)
    return response.status(400).end()
  }
})

router.delete('/:id', async(request, response) => {
  try { 
    const blog = await Blog.findByPk(request.params.id)
    await blog.destroy()

    return response.status(204).end()
  } catch (e) {
    console.log('Blog delete error: ' + e)
    return response.status(400).end()
  }
})

module.exports = router