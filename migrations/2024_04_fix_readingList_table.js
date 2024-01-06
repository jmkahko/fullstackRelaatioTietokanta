const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('reading_lists')

    await queryInterface.createTable('readings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    })

    await queryInterface.createTable('reading_lists', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' }
      },
      reading_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'readings', key: 'id' }
      }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('readings')
    await queryInterface.dropTable('reading_lists')
  }
}