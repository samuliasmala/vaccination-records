const express = require('express');
const createError = require('http-errors');
const router = express.Router();

const log = require('../utils/logger');
const { ensureAuthenticated } = require('../utils/middlewares');

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
router.get('/', ensureAuthenticated, (req, res, next) => {
  let { id, username, default_reminder_email, year_born } = req.user;
  return res.status(200).json({
    id,
    username,
    default_reminder_email,
    year_born
  });
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
 *      "id": 5
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

/**
 * @api {put} /user/update Update user details
 * @apiName UpdateUser
 * @apiGroup User
 * @apiDescription Updates logged in user details. Return true for value which were updated
 *
 * @apiParam {String}   [new_password] User's new password, old password required to update the password
 * @apiParam {String}   [old_password] User's old password
 * @apiParam {String}   [default_reminder_email] User's default reminder email if not equal to username
 * @apiParam {Number}   [year_born] User's birth year
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "year_born": true
 *     }
 */
router.put('/update', ensureAuthenticated, async (req, res, next) => {
  let user = req.user;
  log.debug(`Updating user`, { id: user.id });

  let newData = {};

  // Check which fields are updated
  if (req.body.new_password != null) {
    let match = await UserService.checkUserPassword(
      req.body.old_password,
      user.password_hash
    );
    if (match) {
      newData.password_hash = await UserService.createHashFromPassword(
        req.body.new_password
      );
    }
  }

  if (
    'default_reminder_email' in req.body &&
    req.body.default_reminder_email != user.default_reminder_email
  ) {
    newData.default_reminder_email = req.body.default_reminder_email;
  }

  if ('year_born' in req.body && req.body.year_born != user.year_born) {
    newData.year_born = req.body.year_born;
  }

  // Update user object if any of the fields were updated
  if (Object.entries(newData).length > 0) {
    let userDb = await UserService.findUserById(req.user.id);

    if (userDb == null) {
      log.warn('User not found from DB when updating', { id: req.user.id });
      return next(createError(404, 'User not found'));
    }
    await userDb.update(newData);
  }

  let status = {};
  for (let i in newData) {
    status[i] = true;
  }

  return res.status(200).json(status);
});

module.exports = router;
