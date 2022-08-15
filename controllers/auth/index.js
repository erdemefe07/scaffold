const asyncHandler = require('express-async-handler');
const { userService, sessionService } = require('@services');
const { SESSION_MAX_AGE } = require('@constants');

module.exports = {
  register: asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const savedUser = await userService.createUser(username, password);
    const user = userService.deletePassword(savedUser);
    const session = await sessionService.createSession(user);

    res.cookie('session', session, {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: true,
    });

    res.send(user);
  }),
  login: asyncHandler(async (req, res) => {
    // todo if user is logged in dont log in again
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
  }),
};
