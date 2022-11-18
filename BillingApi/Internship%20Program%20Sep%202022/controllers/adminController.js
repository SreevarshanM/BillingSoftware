const mongoose = require('mongoose');
const { products } = require('../models');
const express = require('express');
const { body, validationResult } = require('express-validator');


exports.getProducts = async (req, res) => {
  try {
    let query = req.query;
    let sortBy;
    if (query.productname) query.productname = query.productname.toUpperCase();

    if (query.sort) {
      sortBy = query.sort.split(',').join(' ');
      query = {};
    }
    const product = await products.find(query).sort(`${sortBy}`);
    if (product.length === 0) throw new Error('No Products Found');

    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({
      message: `${err}`,
      status: false,
    });
  }
};
exports.checkProduct = async (req, res) => {
  try {
    req.query.productname = req.query.productname.toUpperCase();
    let query = req.query;
    console.log(query);

    const [product] = await products.find(query);
    if (!product) {
      throw new Error('Product Not Found');
    }
    console.log(product);
    res.status(200).json({
      message: 'ok',
      status: true,
    });
  } catch (err) {
    res.status(400).json({
      message: 'no',
      status: false,
    });
  }
};

exports.createProducts = async (req, res) => {
  try {
    console.log(req.body.productname);
    req.body.productname = req.body.productname.toUpperCase();
    const product = await products.create(req.body);

    res.status(200).json({
      message: 'Sucessfully created!!',
      status: true,
    });
  } catch (err) {
    res.status(404).json({
      message: `${err}`,
      status: false,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    req.body.productname = req.body.productname.toUpperCase();
    console.log(req.body.productname);
    let [product] = await products
      .find()
      .where('productname')
      .equals(`${req.body.productname}`);
    console.log(product);
    console.log(req.body.quantity);
    if (req.body.quantity < 0)
      if (product.quantity < -req.body.quantity) {
        throw new Error('Insufficient products');
      }
    if (req.body.quantity) {
      console.log(product.quantity);
      req.body.quantity = Number(req.body.quantity) + product.quantity;
    }
    console.log(req.body);
    await products.findByIdAndUpdate(product.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Sucessfully Updated!!',
      status: true,
    });
  } catch (err) {
    res.status(404).json({
      message: `${err}`,
      status: false,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    req.body.productname = req.body.productname.toUpperCase();
    console.log(req.body.productname);
    let [product] = await products
      .find()
      .where('productname')
      .equals(`${req.body.productname}`);
    await products
      .findByIdAndDelete(product.id)
      .then((data) => console.log(data));

    res.status(200).json({
      message: 'Sucessfully Deleted!!',
      status: true,
    });
  } catch (err) {
    res.status(404).json({
      message: `${err}`,
      status: false,
    });
  }
};
