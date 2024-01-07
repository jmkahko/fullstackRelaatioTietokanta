const router = require('express').Router()
const { Blog, User, ReadingList, Session } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async(request, response) => {
  const authorBlogs = await User.findAll({
    include: {
      model: Blog,
      attributes: []
    },
    attributes: [
      ['name', 'kirjoittaja'],
      ['username', 'kayttajanimi'],
      [sequelize.fn('COUNT', sequelize.col('blogs.user_id')), 'blokienMaara'],
      [sequelize.fn('SUM', sequelize.col('blogs.likes')), 'tykkayksia']
    ],
    group: 'user.id'
  })
  
  return response.status(201).json(authorBlogs)
})

module.exports = router