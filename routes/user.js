const express = require('express');
const createError = require('http-errors');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const log = require('../utils/logger');
const config = require('../config');
const mailgun = require('../utils/mailgun');
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
 * @apiSuccess {String}   email User's email
 * @apiSuccess {String}   default_reminder_email User's default reminder email if not equal to the primary email
 * @apiSuccess {Number}   year_born User's birth year
 * @apiSuccess {Number}   reminder_days_before_due How many days before the booster dose due date user wants to get the reminder
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "2",
 *       "email": "samuli",
 *       "default_reminder_email": "samuli.asmala@aalto.fi",
 *       "year_born": "1900",
 *       "reminder_days_before_due": 30
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
    let {
      id,
      username,
      default_reminder_email,
      year_born,
      reminder_days_before_due
    } = req.user;
    return res.status(200).json({
      id,
      email: username,
      default_reminder_email,
      year_born,
      reminder_days_before_due
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /user Create new user
 * @apiName CreateUser
 * @apiGroup User
 * @apiDescription Create a new user and send an email to user's email address to confirm the registration
 *
 * @apiParam {String}   email User's email
 * @apiParam {String}   password User's password
 * @apiParam {String}   [default_reminder_email] User's default reminder email if not equal to the primary email
 * @apiParam {Number}   [year_born] User's birth year
 * @apiParam {Number}   [reminder_days_before_due=30] How many days before the booster dose due date user wants to get the reminder
 *
 * @apiParamExample {json} Request-Example:
{
  "email": "samuli.testing",
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
router.post(
  ['/', '/create'],
  [
    // email must be a valid email
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 }),
    // check optional parameter only if it exits
    check('default_reminder_email')
      .optional()
      .isEmail(),
    check('year_born')
      .optional()
      .isInt({ min: 1800, max: new Date().getFullYear() }),
    check('reminder_days_before_due')
      .optional()
      .isInt()
  ],
  async (req, res, next) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let {
        email,
        password,
        default_reminder_email,
        year_born,
        reminder_days_before_due
      } = req.body;
      log.debug(`Create user`, {
        username: email,
        default_reminder_email,
        year_born,
        reminder_days_before_due
      });

      // Set reminder_days_before_due default value
      reminder_days_before_due =
        reminder_days_before_due == null
          ? config.get('DEFAULT_REMINDER_DAYS')
          : reminder_days_before_due;

      let user = await UserService.createUser(
        email,
        password,
        default_reminder_email,
        year_born,
        reminder_days_before_due
      );
      if (user != null && user.error == null) {
        log.info(`New user created`, { id: user.id, username: user.username });

        // Form and send email
        let msg = {
          to: user.username,
          subject: 'Welcome to Vaccination eRecord',
          text: `Hi and welcome to Vaccination eRecord!

We hope this service will be highly useful! If you have any questions or feedback please don't hesitate to contact us at info@rokotuskortti.com!

Best regards,
The Vaccination eRecord team`
        };
        await mailgun.send(msg);
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
  }
);

/**
 * @api {put} /user Update user details
 * @apiName UpdateUser
 * @apiGroup User
 * @apiDescription Updates logged in user details. Return true for value which were updated
 *
 * @apiParam {String}   [new_password] User's new password, old password required to update the password
 * @apiParam {String}   [old_password] User's old password
 * @apiParam {String}   [default_reminder_email] User's default reminder email if not equal to the primary email
 * @apiParam {Number}   [year_born] User's birth year
 * @apiParam {Number}   [reminder_days_before_due] How many days before the booster dose due date user wants to get the reminder
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
router.put(
  ['/', '/update'],
  [
    // password must be at least 5 chars long
    check('new_password')
      .optional()
      .isLength({ min: 5 }),
    // check optional parameter only if it exits
    check('default_reminder_email')
      .optional()
      .isEmail(),
    check('year_born')
      .optional()
      .isInt({ min: 1800, max: new Date().getFullYear() }),
    check('reminder_days_before_due')
      .optional()
      .isInt()
  ],
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let newData = getChangedFields(
        ['default_reminder_email', 'year_born', 'reminder_days_before_due'],
        req.body,
        req.user
      );

      // Check which fields are updated
      if (req.body.new_password != null) {
        let match = await UserService.checkUserPassword(
          req.body.old_password,
          req.user.password_hash
        );
        if (match) {
          newData.password_hash = await UserService.createHashFromPassword(
            req.body.new_password
          );
        }
      }

      log.debug(`Updating user`, { id: req.user.id, newData });

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
  }
);

module.exports = router;
