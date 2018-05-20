const { validationResult } = require('express-validator/check');

exports.validate = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.mapped()
    })
  }
  else {
    next();
  }
}