const express = require('express');
const createError = require('http-errors');
const router = express.Router();

const log = require('../utils/logger');
const { ensureAuthenticated } = require('../utils/middlewares');
const { getChangedFields } = require('../utils/utils');

const UserService = require('../services/UserService');

/**
 * @api {get} /user Get user details
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission logged in
 * @apiDescription Get details of the current (logged in) user
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
  try {
    let { id, username, default_reminder_email, year_born } = req.user;
    return res.status(200).json({
      id,
      username,
      default_reminder_email,
      year_born
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /user Create new user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String}   username User's username (i.e. user's primary email)
 * @apiParam {String}   password User's password
 * @apiParam {String}   [default_reminder_email] User's default reminder email if not equal to username
 * @apiParam {Number}   [year_born] User's birth year
 *
 * @apiParamExample {json} Request-Example:
{
  "username": "samuli.testing",
  "password": "salasana",
  "default_reminder_email": "address@email",
  "year_born": 1905
}
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "id": 5
 *     }
 */
router.post(['/', '/create'], async (req, res, next) => {
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
 * @api {put} /user Update user details
 * @apiName UpdateUser
 * @apiGroup User
 * @apiDescription Updates logged in user details. Return true for value which were updated
 *
 * @apiParam {String}   [new_password] User's new password, old password required to update the password
 * @apiParam {String}   [old_password] User's old password
 * @apiParam {String}   [default_reminder_email] User's default reminder email if not equal to username
 * @apiParam {Number}   [year_born] User's birth year
 *
 * @apiParamExample {json} Request-Example:
{
  "default_reminder_email": "testiosoite@test",
  "year_born": 2005,
  "new_password": "uusi_salasana",
  "old_password": "salasana"
}
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 {
    "password_hash": true,
    "default_reminder_email": true,
    "year_born": true
}
 */
router.put(['/', '/update'], ensureAuthenticated, async (req, res, next) => {
  try {
    let user = req.user;

    let newData = getChangedFields(
      ['default_reminder_email', 'year_born'],
      req.body,
      user
    );

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

    log.debug(`Updating user`, { id: user.id, newData });

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
  } catch (err) {
    next(err);
  }
});

module.exports = router;
