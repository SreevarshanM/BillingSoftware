const express = require('express');
const validationResult = require('./middleware.js');
const bodyValidator = require('./bodyValidatorSchema.js');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/products')
  .get(authController.protect, adminController.getProducts);
router
  .route('/checkProduct')
  .get(authController.protect, adminController.checkProduct);
router
  .route('/createProduct')
  .post(
    authController.protect,
    bodyValidator.createSchema,
    validationResult.validateRequestSchema,
    adminController.createProducts
  );
router
  .route('/updateProduct')
  .patch(authController.protect, adminController.updateProduct);
router
  .route('/deleteProduct')
  .delete(authController.protect, adminController.deleteProduct);

module.exports = router;
