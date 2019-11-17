const LocalStrategy = require('passport-local').Strategy;

const UserService = require('../services/UserService');
const log = require('./logger');

function setupPassport(passport) {
  // Configure the local strategy for use by Passport.
  //
  // The local strategy require a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `cb` with a user object, which
  // will be set at `req.user` in route handlers after authentication.
  let strategy = new LocalStrategy(async (username, password, cb) => {
    try {
      let user = await UserService.findByUsername(username);
      if (user == null) {
        log.debug('User not found');
        return cb(null, false);
      }
      if (user.password != password) {
        log.debug('Incorrect password when logging in');
        return cb(null, false);
      }
      log.debug(
        { username: user.username },
        'User logged in using local user database'
      );
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  });

  passport.use(strategy);

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    try {
      const user = await UserService.findUserById(user.id);
      if (user) {
        done(null, user);
      } else {
        throw new Error();
      }
    } catch (err) {
      log.error(`Deserializing user failed.`);
      log.error(err);
      done(err, null);
    }
  });
}

module.exports = setupPassport;
