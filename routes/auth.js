const express = require('express');
const createError = require('http-errors');
const passport = require('passport');
const router = express.Router();

const log = require('../utils/logger');

const UserService = require('../services/UserService');

/**
 * @api {post} /login User login
 * @apiName UserLogin
 * @apiGroup Authentication
 *
 * @apiParam {String}   username User's username (i.e. user's primary email)
 * @apiParam {String}   password User's password
 *
 * @apiParamExample {json} Request-Example:
{
  "username": "samuli.testaa",
  "password": "salasana"
}
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "Authorized"
 *     }
 */
router.post('/login', (req, res, next) => {
  try {
    let { username } = req.body;
    log.debug(`User logging in`, { username });

    passport.authenticate('local', function(err, user, info) {
      // Error in login process
      if (err) {
        return next(err);
      }

      // Login was not successfull
      if (!user) {
        log.debug(`Invalid username or password`, { username });
        return res.status(401).json({ status: 'Invalid username or password' });
      }

      return req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }

        log.info('User logged in', {
          username: username,
          session: req.session.id.slice(0, 6)
        });
        return res.status(200).json({ status: 'Authorized' });
      });
    })(req, res, next);
  } catch (err) {
    next(err);
  }
});

/**
 * @api {get} /logout User logout
 * @apiName UserLogout
 * @apiGroup Authentication
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "Logged out"
 *     }
 */
router.get('/logout', (req, res, next) => {
  log.debug(`User logging out`, { username: req.user.username });

  req.logout();
  return res.status(200).json({ status: 'Logged out' });
});

/**
 * @api {get} /version Get application version number
 * @apiName VersionInfo
 * @apiGroup Authentication
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "version": "0.1.0"
 *     }
 */
router.get('/version', (req, res, next) => {
  return res.status(200).json({ version: process.env.npm_package_version });
});

module.exports = router;
