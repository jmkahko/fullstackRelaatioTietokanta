const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')
const errorHandler = require('../util/errorHandler')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

router.get('/', async(request, response) => {
  let where = {}

  if (request.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${request.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${request.query.search}%`
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { 
      exclude: ['userId'] 
    },
    include: {
      model: User,
      attributes: ['id', 'username', 'name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  response.json(blogs)
})

router.post('/', async(request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLocaleLowerCase().startsWith('bearer ')) {
    try {
      const unencoding = jwt.verify(authorization.substring(7), process.env.SECRET)
      await User.findOne({
        where: {
          username: unencoding.username
        }
      }).then(async user => {
        await Blog.create({ ...request.body, userId: user.id })
        .then(async blog => {
          return response.status(201).json(blog)
        }).catch(error => next(error))
      }).catch(error => next(error))
    } catch (e) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    return response.status(401).json({ error: 'token missing' })
  }
  next()
})

router.delete('/:id', async(request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLocaleLowerCase().startsWith('bearer ')) {
    try {
      const unencoding = jwt.verify(authorization.substring(7), process.env.SECRET)
      await User.findOne({
        where: {
          username: unencoding.username
        }
      }).then(async user => {
        const blog = await Blog.findByPk(request.params.id)

        if (user.id === blog.userId) {
          blog.destroy()
          return response.status(204).end()
        } else {
          return response.status(401).json({ error: 'the user is not the added of the blog ' })
        }
      }).catch(error => next(error))
    } catch (e) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    return response.status(401).json({ error: 'token missing' })
  }
  next()
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