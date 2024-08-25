const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

router.get('/me', async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});


module.exports = router; 
