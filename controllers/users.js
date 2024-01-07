const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const errorHandler = require('../util/errorHandler')
const { Op } = require('sequelize')

router.get('/', async(request, response) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  response.json(users)
})

router.post('/', async(request, response, next) => {
  const { name, username, password } = request.body
  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = {
    name: name,
    username: username,
    password: passwordHash
  }

  await User.create(newUser)
    .then(user => {
      return response.status(201).json(user)
    })
    .catch(error => next(error))
})

router.put('/:username', async(request, response, next) => {
  await User.update({ name: request.body.name }, {
      where: {
        username: request.params.username
      }
    })
    .then(() => {
      return response.status(201).end()
    })
    .catch(error => next(error))
})

router.get('/:id', async(request, response, next) => {
  const where = {}

  if (request.query.read) {
    where.read = request.query.read === "true"
  }

  const user = await User.findByPk(request.params.id, {   
    include: {
      model: Blog,
      as: 'readingBlogs',
      attributes: [
        ['id', 'id'],
        ['url', 'url'],
        ['title', 'title'],
        ['author', 'author'],
        ['likes', 'likes'],
        ['year', 'year']
      ],
      through: {
        attributes: [
          ['read', 'read'],
          ['id', 'id']
        ],
        where
      }
    },
    attributes: [
      ['name', 'name'],
      ['username', 'username']
    ]
  })

  if (user === null) {
    return response.status(401).json({ error: 'cannot not find user' })
  }

  return response.status(201).json(user)
})

router.use(errorHandler)

module.exports = router