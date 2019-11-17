const bcrypt = require('bcrypt');

const log = require('../utils/logger');
const { User } = require('../models');

const saltRounds = 10;

async function findUserById(id) {
  log.debug('Finding user by id', { id });
  const user = await User.findByPk(id);
  return user;
}

async function createUser(username, password, reminderEmail, yearBorn) {
  log.debug('Creating new user', { username });

  // Check if user exists already
  let existingUser = await findByUsername(username);
  if (existingUser != null) {
    return {
      error: true,
      message: 'Username exists already'
    };
  }

  let hash = await bcrypt.hash(password, saltRounds);
  let user = await User.create({
    username: username,
    password_hash: hash,
    default_reminder_email: reminderEmail,
    year_born: yearBorn
  });
  return user;
}

async function findByUsername(username) {
  log.debug('Finding user by username', { username });
  const user = await User.findOne({
    where: {
      username: username
    }
  });
  return user;
}

async function checkUserPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  findUserById,
  createUser,
  findByUsername,
  checkUserPassword
};
