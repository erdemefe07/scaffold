const express = require('express');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const initRoutes = require('./routes');
const { UnSuccess } = require('@exceptions');

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());
app.use(express.json());
initRoutes(app);

app.use((err, req, res, next) => {
  if (!err) {
    next();
  }

  switch (true) {
    case err instanceof UnSuccess:
      res.status(400);
      return res.json({ success: false, msg: err.msg });

    default:
      if (process.env.NODE_ENV !== 'test') {
        console.log(err);
      }
      res.json({ success: false, msg: 'Unknown Error' });
  }
});

module.exports = app;
