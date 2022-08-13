const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { userValidator, validate } = require('@validators');
const { userService, sessionService } = require('@services');
const { SESSION_MAX_AGE } = require('@constants');

router.post(
  '/register',
  validate(userValidator.register),
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const savedUser = await userService.createUser(username, password); // TODO handle username already exists
    const user = userService.deletePassword(savedUser);
    const session = await sessionService.createSession(user);

    res.cookie('session', session, {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: true,
    });

    res.send(user);
  })
);

router.post(
  '/login',
  validate(userValidator.login),
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const passwordedUser = await userService.validatePassword(username, password);
    const user = userService.deletePassword(passwordedUser);
    const session = await sessionService.createSession(user);

    res.cookie('session', session, {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: true,
    });

    res.send(user);
  })
);

module.exports = router;
