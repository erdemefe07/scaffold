class UnSuccess {
  constructor(options) {
    Error.call(this);
    Error.captureStackTrace(this);
    if (typeof options === 'string') {
      return (this.msg = options);
    }

    this.msg = options.msg;
    this.log = options.log;
    if (process.env.NODE_ENV !== 'test') {
      console.log(this.log);
    }
  }
}

module.exports = {
  UnSuccess,
};
