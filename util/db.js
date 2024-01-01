const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const sequelize = new Sequelize(DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected')
  } catch (e) {
    console.log('Database connecting error : ' + e)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }