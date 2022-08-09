const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const argon2 = require('argon2');
const { User } = require('@models');
const { userValidator, validate } = require('@validators');
const { cookie } = require('@utils');

router.post(
  '/register',
  validate(userValidator.register),
  asyncHandler(async (req, res) => {
    if (req.cookies.session) return res.json({ success: false });

    const { username, password } = req.body;

    const user = new User({
      username,
      password,
    });

    const saved = await user.save();
    const response = saved.toJSON();
    delete response.password;
    await cookie(res, response);
    res.send(response);
  })
);

router.post(
  '/login',
  validate(userValidator.login),
  asyncHandler(async (req, res) => {
    if (req.cookies.session) return res.json({ success: false });

    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');
    if (!user)
      return res.json({
        success: false,
        msg: 'Username or Password is wrong!',
      });

    const isValidPass = await argon2.verify(user.password, password);
    if (!isValidPass)
      return res.json({
        success: false,
        msg: 'Username or Password is wrong!',
      });

    const response = user.toJSON();
    delete response.password;

    await cookie(res, response);
    res.send(response);
  })
);

module.exports = router;
