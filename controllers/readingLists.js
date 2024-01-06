const router = require('express').Router()
const { ReadingList, Blog, User } = require('../models')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')

router.post('/', async(request, response, next) => {  
  await ReadingList.create({ userId: request.body.user_id, blogId: request.body.blog_id }).then(reading => {
    return response.status(201).json({ message: 'blog added'})
  }).catch(error => next(error))

  next()
})

router.put('/:id', async(request, response, next) => {  
  const authorization = request.get('authorization')

  if (authorization && authorization.toLocaleLowerCase().startsWith('bearer ')) {
    try {
      const unencoding = jwt.verify(authorization.substring(7), process.env.SECRET)
      await User.findOne({
        where: {
          username: unencoding.username
        }
      }).then(async user => {
        await ReadingList.findOne({
          where: {
            [Op.and]: [
              { blogId: request.params.id },
              { userId: user.id }
            ]
          }
        }).then(async reading => {
          if (reading === null) {
            return response.status(401).json({ error: 'maybe blog is not user' })
          }

          reading.read = request.body.read
          await reading.save()
          return response.status(201).json({ 'read': request.body.read })
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

module.exports = router