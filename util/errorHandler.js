const errorHandler = (error, request, response, next) => {
  if (error.name === 'TypeError') {
    return response.status(400).send({ error : 'cannot find id or username or account is disabled' })
  } 
  
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError' || error.name === 'Error') {
    const errorMessage = error.name + ': ' + error.message
    return response.status(400).send({ error : errorMessage })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).send({ error : 'username must be unique' })
  }

  next(error)
}

module.exports = errorHandler