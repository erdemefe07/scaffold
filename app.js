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
app.use(express.json()); // TODO if user sends invalid json throw error
initRoutes(app);

app.use((err, req, res, next) => {
  if (!err) next();

  switch (true) {
    case err instanceof UnSuccess:
      return res.json({ success: false, msg: err.msg });

    default:
      console.log(err);
      res.json({ success: false, msg: 'Unknown Error' });
  }
});

module.exports = app;
