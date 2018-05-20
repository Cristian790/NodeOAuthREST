const { sanitizeBody } = require('express-validator/filter');
const { check } = require('express-validator/check');

module.exports = {
  checking: [
    check('password', 'password required inmediatly').isLength({ min: 4 }).trim(),
    check('email', 'Enter a valid email address').isEmail().trim(),
    sanitizeBody('*').trim().escape()
  ]
}