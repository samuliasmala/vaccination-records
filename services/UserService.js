const log = require('../utils/logger');
const { userModel } = require('../models/user');

async function findUserById(id) {
  log.debug(id, 'Finding user by id');
  const user = await userModel.findById(id);
  return user;
}

module.exports = {
  findUserById
};
