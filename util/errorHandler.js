const errorHandler = (error, request, response, next) => {
  if (error.name === 'TypeError') {
    return response.status(400).send({ error : 'cannot find id' })
  } 
  
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
    const errorMessage = error.name + ': ' + error.message
    return response.status(400).send({ error : errorMessage })
  }

  next(error)
}

module.exports = errorHandler