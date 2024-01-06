const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class ReadingList extends Model {}
ReadingList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id' }
  },
  readingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'readings', key: 'id' }
  }
}, {
  sequelize,
  timestamps: false,
  underscored: true,
  modelName: 'readingList'
})

module.exports = ReadingList