var createError = require('http-errors');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    return next();
  } else {
    return next(createError(401, 'UserNotLoggedIn'));
  }
}

module.exports = {
  ensureAuthenticated
};
