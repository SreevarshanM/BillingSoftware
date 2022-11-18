const { validationResult } = require('express-validator');
exports.validateRequestSchema = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    [error] = errors.array();
    console.log(error);
    return res.status(400).json({
      errors: error.msg,
    });
  }
  next();
};
