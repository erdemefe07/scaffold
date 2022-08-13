const argon2 = require('argon2');
const { User } = require('@models');
const { UnSuccess } = require('@exceptions');

module.exports = {
  async createUser(username, password) {
    try {
      const user = new User({
        username,
        password,
      });

      return await user.save();
    } catch (error) {
      throw new UnSuccess({ msg: 'Unknown Error', log: error });
    }
  },
  deletePassword(user) {
    user = user.toJSON();
    delete user.password;
    return user;
  },
  async validatePassword(username, password) {
    const user = await User.findOne({ username }).select('+password');
    if (!user) throw new UnSuccess('Username or Password is wrong!');

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) throw new UnSuccess('Username or Password is wrong!');
    return user;
  },
  async changePassword(username, oldPassword, password) {
    const user = await this.validatePassword(username, oldPassword);
    user.password = password;
    return await user.save();
  },
};
