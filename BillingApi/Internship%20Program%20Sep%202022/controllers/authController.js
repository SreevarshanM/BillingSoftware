const mongoose = require('mongoose');
const { users } = require('../models');
const { promisify } = require('util');
const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'my-ultra-secure-and-ultra-long-secret';

const createToken = (id) => {
  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '90hr',
  });
  return token;
};

exports.protect = async (req, res, next) => {
  try {
    //Getting token and check if it 's there
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'null') {
      throw new Error('You are not logged in.Please log in again!');
    }
    //Verification token
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    // check if user still exists
    const currentUser = await users.findById(decoded.id);
    console.log(currentUser);
    if (!currentUser) {
      throw new Error('The user belonging to this token does no longer exist.');
    }
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      message: `${err}`,
      status: 401,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const userList = await users.find();
    if (userList) {
      res.status(200).json(userList);
    } else {
      throw new Error('Something Went Wrong');
    }
  } catch (err) {
    res.status(404).json({
      message: `${err}`,
      status: false,
    });
  }
};

exports.checkLogin = async (req, res) => {
  try {
    const [user] = await users
      .find({
        status: 'Approved',
      })
      .find({
        username: req.body.username,
      });

    if (user) {
      if (await user.correctPassword(req.body.password, user.password)) {
        const token = createToken(user._id);

        res.status(200).json({
          token,
          role: `${user.role}`,
          message: 'ok',
          status: true,
        });
      } else {
        throw new Error('Incorrect username or password');
      }
    } else {
      throw new Error('Incorrect username or password');
    }
  } catch (error) {
    res.status(404).json({
      message: `${error}`,
      status: false,
    });
  }
};

exports.getApproved = async (req, res) => {
  try {
    const userList = await users.find({
      status: 'Approved',
    });
    if (!userList) {
      throw new Error('fail');
    }
    res.status(200).json(userList);
  } catch (err) {
    res.status(404).json({
      message: ' Failed!!',
      status: false,
    });
  }
};

exports.getWaiting = async (req, res) => {
  try {
    const userList = await users.find({
      status: 'Waiting',
    });
    res.status(200).json(userList);
  } catch (err) {
    res.status(404).json({
      message: ' Failed!!',
      status: false,
    });
  }
};
exports.getRejected = async (req, res) => {
  try {
    const userList = await users.find({
      status: 'Rejected',
    });
    res.status(200).json(userList);
  } catch (err) {
    res.status(404).json({
      message: ' Failed!!',
      status: false,
    });
  }
};

exports.updateUsers = async (req, res) => {
  try {
    const status = req.body.status;
    const username = req.body.username;
    const userList = await users.findOneAndUpdate(
      {
        username,
      },
      {
        status: `${status}`,
      }
    );
    if (!userList) {
      throw new Error('No User Found');
    }
    res.status(200).json({
      message: 'Sucessfully Updated!!',
      status: true,
    });
  } catch (err) {
    res.status(400).json({
      message: ' Failed!!',
      status: false,
    });
  }
};

exports.addUser = async (req, res) => {
  try {
    const user = await users.create(req.body);
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

exports.restrictTo = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({
      message: 'you do not have permission to perform this action',
      status: 403,
    });
    return;
  }
  next();
};
