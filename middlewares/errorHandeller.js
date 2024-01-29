const CustomErrorHandeller = require('../errors/custom-errors')

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomErrorHandeller) {
    return res.status(err.stateCode).json({ success: false, msg: err.message })
  }
  res.status(500).json({ success: false, msg: 'Error' })
};

module.exports = errorHandler;
