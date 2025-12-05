// middleware/validation.js
const { body } = require('express-validator');

const validateUser = [
  body('username').isLength({ min: 3, max: 20 }),
  body('email').isEmail(),
  body('bio').isLength({ min: 10, max: 500 }),
  body('interests').isArray({ min: 1, max: 10 })
];

module.exports = { validateUser };
