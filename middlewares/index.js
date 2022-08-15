const asyncHandler = require('express-async-handler');
const { client } = require('@redisClient');

module.exports = {
  authenticateMiddleware: asyncHandler(async (req, res, next) => {
    const { session } = req.cookies;
    if (!session) {
      res.status(401);
      return res.json({ success: false, msg: 'Unauth' });
    }

    const user = await client().get(`session:${session}`);
    if (!user) {
      res.status(401);
      return res.json({ success: false, msg: 'Unauth' });
    }

    req.user = JSON.parse(user);
    next();
  }),
};
