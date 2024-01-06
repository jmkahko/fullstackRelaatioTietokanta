const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')
const { parseInt } = require('lodash')

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
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },  
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      minMaxYear(value) {
        const yearNow = new Date().getFullYear()
        if(parseInt(value) < 1991 || parseInt(value) > yearNow) {
          throw new Error('year is wrong. Year minimum 1991 and max ' + yearNow)
        }
      }
    }
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'blog'
})

module.exports = Blog