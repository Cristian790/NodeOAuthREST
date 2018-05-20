const express = require('express');
const app = express();

exports.notFound = (req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
}

exports.errorHandler = (err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: error
    }
  });
}