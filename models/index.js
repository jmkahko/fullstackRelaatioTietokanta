const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readingBlogs' })
Blog.belongsToMany(User, { through: ReadingList, as: 'usersReaded' })

module.exports = { Blog, User, ReadingList, Session }