const router = require('express').Router()
const { ReadingList, Reading, Blog, User } = require('../models')

router.post('/', async(request, response, next) => {  
  await Reading.create({ read: false }).then(async read => {
    await ReadingList.create({ userId: request.body.user_id, blogId: request.body.blog_id, readingId: read.id }).then(reading => {
      return response.status(201).json({ message: 'blog added'})
    }).catch(error => next(error))
  }).catch(error => next(error))

  next()
})

module.exports = router