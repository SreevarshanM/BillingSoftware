const { body } = require('express-validator');

exports.loginschema = [
  body('username').exists({ checkFalsy: true }),
  body('password').isLength({ min: 5 }).withMessage('Inavlid Password'),
];

exports.signupSchema = [
  body('email').isEmail(),
  body('username').exists({ checkFalsy: true }),
  body('password').isLength({ min: 5 }),
];

exports.createSchema = [
  body('productname').exists({ checkFalsy: true }),
  body('category').exists({ checkFalsy: true }),
  body('unit').exists({ checkFalsy: true }),
  body('unitprice').isNumeric(),
  body('quantity').isNumeric(),
  body('MRP').isNumeric(),
  body('brandname').exists({ checkFalsy: true }),
  body('manufacturedate').isDate(),
  body('expirydate').isDate(),
];
