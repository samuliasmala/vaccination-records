const bcrypt = require('bcrypt');

const log = require('../utils/logger');
const { User } = require('../models');

const saltRounds = 10;

async function findUserById(id) {
  log.debug('Finding user by id', { id });
  const user = await User.findByPk(id);
  return user;
}

async function createUser(
  username,
  password,
  reminderEmail,
  yearBorn,
  reminderDaysBeforeDue
) {
  log.debug('Creating new user', { username });

  // Check if user exists already
  let existingUser = await findByUsername(username);
  if (existingUser != null) {
    return {
      error: true,
      message: 'Username exists already'
    };
  }

  let hash = await createHashFromPassword(password);
  let user = await User.create({
    username: username,
    password_hash: hash,
    default_reminder_email: reminderEmail,
    year_born: yearBorn,
    reminder_days_before_due: reminderDaysBeforeDue
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
  return bcrypt.compare(password, hash);
}

async function createHashFromPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

module.exports = {
  findUserById,
  createUser,
  findByUsername,
  createHashFromPassword,
  checkUserPassword
};
