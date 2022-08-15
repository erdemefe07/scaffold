class UnSuccess {
  constructor(options) {
    Error.call(this);
    Error.captureStackTrace(this);
    if (typeof options === 'string') {
      return (this.msg = options);
    }

    this.msg = options.msg;
    this.log(options.log);
  }

  // eslint-disable-next-line no-unused-vars
  log(data) {
    // LOGGING LOGIC
  }
}

module.exports = {
  UnSuccess,
};
