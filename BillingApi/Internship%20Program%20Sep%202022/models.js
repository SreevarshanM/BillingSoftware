const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

////////USER SCHEMA////////////

const schemaUser = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'username must defined'],
    maxlength: [30, 'username must have less or equal than 30 characters'],
    mimlength: [5, 'username must have more or equal than 5 characters'],
    validate: [validator.isAlpha, 'username must only contain characters'],
  },
  password: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

////////////////PRODUCTS SCHEMA//////////////////

const productSchema = new mongoose.Schema({
  productname: {
    type: String,
    unique: true,
    required: [true, 'Product Name must exist!'],
  },
  category: {
    type: String,
    required: [true, 'Category must exist!'],
  },
  unit: {
    type: String,
    required: [true, 'unit must exist!'],
  },
  unitprice: {
    type: Number,
    required: [true, 'unit price must exist!'],
  },
  quantity: {
    type: Number,
    required: [true, 'quantity must exist!'],
  },
  MRP: {
    type: Number,
    required: [true, ' MRP must exist!'],
  },
  brandname: {
    type: String,
    required: [true, 'Brand Name must exist!'],
  },
  manufacturedate: {
    type: Date,
    required: [true, 'Manufacture Date must exist!'],
  },
  expirydate: {
    type: Date,
    required: [true, 'Expiry Date must exit!'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

schemaUser.pre('save', async function (next) {
  //only run this functioon if password is modified
  if (!this.isModified('password')) return next();

  //Hash the function with cost of 12

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schemaUser.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

exports.users = mongoose.model('users', schemaUser);
exports.products = mongoose.model('products', productSchema);
