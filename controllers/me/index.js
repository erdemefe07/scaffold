const asyncHandler = require('express-async-handler');
const { sessionService, userService } = require('@services');
const { SESSION_MAX_AGE } = require('@constants');

module.exports = {
  getMe: asyncHandler(async (req, res) => {
    res.send(req.user);
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { oldPassword, password } = req.body;

    const passwordedUser = await userService.changePassword(req.user.username, oldPassword, password);
    const user = await userService.deletePassword(passwordedUser);

    await sessionService.removeSession(req.cookies.session);
    const session = await sessionService.createSession(user);

    res.cookie('session', session, {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: true,
    });

    res.send(user);
  }),

  logout: asyncHandler(async (req, res) => {
    await sessionService.removeSession(req.cookies.session);

    res.cookie('session', 'logout', {
      maxAge: 1,
      httpOnly: true,
      secure: true,
    });

    res.json({ success: true });
  }),
};
