const errorHandler = (err, req, res, next) => {
  res.status(500).json({ success: false, msg: err.message });
};

module.exports = errorHandler;
