const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog, ReadingList, Session } = require('../models')
const errorHandler = require('../util/errorHandler')

router.post('/', async(request, response, next) => {
  const { username, password } = request.body

  await User.findOne({
    where: { 
      username: username
    }
  }).then(async user => {
    if (user.disabled) {
      return response.status(401).send({ error: 'account: ' + user.username + ' is disabled' })
    }

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password)
    if (!passwordCorrect) {
      return response.status(400).send({ error: 'username or password failed' })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })
    await Session.create({ tokenSessio: token })
    return response.status(200).send({ token, username: user.username, name: user.name })
  }).catch(error => next(error))
})

router.use(errorHandler)

module.exports = router