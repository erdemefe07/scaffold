const asyncHandler = require('express-async-handler');
const { client } = require('@redisClient');

module.exports = {
  Authenticate: asyncHandler(async (req, res, next) => {
    const { session } = req.cookies;
    if (!session) return res.json({ success: false, msg: 'Unauth' });

    const user = await client().get(`session:${session}`);
    if (!user) return res.json({ success: false, msg: 'Unauth' });

    req.user = JSON.parse(user);
    next();
  }),
};
