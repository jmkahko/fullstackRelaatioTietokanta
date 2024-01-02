const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog } = require('../models')
const errorHandler = require('../util/errorHandler')

router.get('/', async(request, response) => {
  const users = await User.findAll()
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

router.use(errorHandler)

module.exports = router