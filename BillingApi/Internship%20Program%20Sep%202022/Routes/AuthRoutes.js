const express = require('express');
const validationResult = require('./middleware.js');
const bodyValidator = require('./bodyValidatorSchema.js');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/login')
  .post(
    bodyValidator.loginschema,
    validationResult.validateRequestSchema,
    authController.checkLogin
  );
router
  .route('/signup')
  .post(
    bodyValidator.signupSchema,
    validationResult.validateRequestSchema,
    authController.addUser
  );
router
  .route('/getUsers')
  .get(
    authController.protect,
    authController.restrictTo,
    authController.getUsers
  );
router
  .route('/getApproved')
  .get(
    authController.protect,
    authController.restrictTo,
    authController.getApproved
  );
router
  .route('/getWaiting')
  .get(
    authController.protect,
    authController.restrictTo,
    authController.getWaiting
  );
router
  .route('/getRejected')
  .get(
    authController.protect,
    authController.restrictTo,
    authController.getRejected
  );
router
  .route('/updateUser')
  .patch(
    authController.protect,
    authController.restrictTo,
    authController.updateUsers
  );
module.exports = router;
