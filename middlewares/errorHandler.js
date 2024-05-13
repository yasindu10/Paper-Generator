const ErrorHandler = require('../errors/customErrors')

const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorHandler) {
    console.log('custom error', err.message)
    return res.status(err.stateCode).json({ success: false, msg: err.message })
  }
  console.log('ground error', err.message)
  res.status(500).json({ success: false, msg: err.message })
};

module.exports = errorHandler;