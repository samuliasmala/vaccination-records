var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const log = require('../utils/logger');

const UserService = require('../services/UserService');

/**
 * @api {get} /user Get details of the current (logged in) user
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission logged in
 *
 * @apiSuccess {Number}   id id of the user
 * @apiSuccess {String}   username User's username (i.e. user's primary email)
 * @apiSuccess {String}   default_reminder_email User's default reminder email if not equal to username
 * @apiSuccess {Number}   year_born User's birth year
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "2",
 *       "username": "samuli",
 *       "default_reminder_email": "samuli.asmala@aalto.fi",
 *       "year_born": "1900"
 *     }
 *
 * @apiError (401) UserNotLoggedIn User must log in to access own profile description
 *
 * @apiErrorExample {json} Error-Response
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "error": "UserNotLoggedIn"
 *    }
 */
router.get('/', (req, res, next) => {
  if (true) {
    //req.isAuthenticated() && req.user) {
    return res.status(200).json({
      id: 1,
      username: 'samuli',
      default_reminder_email: 'samuli.asmala@aalto.fi',
      year_born: 1900
    });
  } else {
    return res.status(401).json({ error: 'UserNotLoggedIn' });
  }
});

/**
 * @api {post} /user/create Create new user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String}   username User's username (i.e. user's primary email)
 * @apiParam {String}   password User's password
 * @apiParam {String}   [default_reminder_email] User's default reminder email if not equal to username
 * @apiParam {Number}   [year_born] User's birth year
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "samuli",
 *       "username": "passwd",
 *       "year_born": "1900"
 *     }
 */
router.post('/create', async (req, res, next) => {
  try {
    let { username, password, default_reminder_email, year_born } = req.body;
    log.debug(`Create user`, { username, default_reminder_email, year_born });
    let user = await UserService.createUser(
      username,
      password,
      default_reminder_email,
      year_born
    );
    if (user != null && user.error == null) {
      log.info(`New user created`, { id: user.id, username: user.username });
      return res.status(200).json({
        id: user.id
      });
    } else {
      log.info(`Unable to create user: ${user.message}`);
      next(createError(400, user.message));
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
