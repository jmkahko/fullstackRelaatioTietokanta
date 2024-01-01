require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)
const PORT = process.env.PORT || 3001

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})
Blog.sync()

app.use(express.json())

app.get('/api/blogs', async(request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
})

app.post('/api/blogs', async(request, response) => {
  try {
    const blog = await Blog.create(request.body)
    return response.status(201).json(blog)
  } catch (e) {
    console.log('Blog save error: ' + e)
    return response.status(400).end()
  }
})

app.delete('/api/blogs/:id', async(request, response) => {
  try { 
    const blog = await Blog.findByPk(request.params.id)
    await blog.destroy()

    return response.status(204).end()
  } catch (e) {
    console.log('Blog delete error: ' + e)
    return response.status(400).end()
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})