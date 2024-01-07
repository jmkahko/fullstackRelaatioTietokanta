const router = require('express').Router()
const { ReadingList, Blog, User, Session } = require('../models')

router.delete('/', async(request, response, next) => {  
  const authorization = request.get('authorization')

  if (authorization && authorization.toLocaleLowerCase().startsWith('bearer ')) {
    try {
      await Session.findOne({
        where: {
          tokenSessio: authorization.substring(7)
        }
      }).then(sessio => {
        if (sessio === null) {
          return response.status(401).json({ error: 'sessio invalid' })
        }

        sessio.destroy()
        return response.status(201).json({ message: 'logout' })
      }).catch(error => next(error))
    } catch (e) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    return response.status(401).json({ error: 'token missing' })
  }

  next()
})

module.exports = router