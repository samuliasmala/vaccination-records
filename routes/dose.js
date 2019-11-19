const express = require('express');
const createError = require('http-errors');
const moment = require('moment-timezone');
const router = express.Router();

const config = require('../config');
const log = require('../utils/logger');

const DoseService = require('../services/DoseService');

/**
 * @api {get} /dose Get all dosess for the current (logged in) user
 * @apiName GetDose
 * @apiGroup Dose
 * @apiPermission logged in
 *
 * @apiSuccess {Object[]} doses List of doses
 * @apiSuccess {Number}   doses.id id of the dose
 * @apiSuccess {Number}   doses.vaccine_id id of the vaccine
 * @apiSuccess {String}   doses.vaccine_name Name of the vaccination
 * @apiSuccess {String}   doses.vaccine_abbreviation Abbreviation of the vaccination
 * @apiSuccess {Date}     doses.date_taken Date when the dose was taken
 * @apiSuccess {Date}     doses.booster_due_date Date when the booster dose is due
 * @apiSuccess {Boolean}  doses.booster_email_reminder Has user subscribed for booster email reminder
 * @apiSuccess {String}   doses.booster_reminder_address Email address where booster email is sent
 * @apiSuccess {String}   doses.comment User's comment for the dose, e.g. place taken
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
          // TODO

 * @apiError (401) UserNotLoggedIn User must log in to access own profile description
 *
 * @apiErrorExample {json} Error-Response
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "error": "UserNotLoggedIn"
 *    }
 */

router.get('/', async (req, res, next) => {
  try {
    let doses = await DoseService.getAllDoses(req.user.id);
    return res.status(200).json(
      doses.map(dose => {
        return {
          id: dose.get('id'),
          vaccine_id: dose.Vaccine.get('id'),
          vaccine_name: dose.Vaccine.get('name'),
          vaccine_abbreviation: dose.Vaccine.get('abbreviation'),
          date_taken: moment(dose.get('date_taken')).format(
            config.get('DATE_FORMAT')
          ),
          booster_due_date: moment(dose.get('booster_due_date')).format(
            config.get('DATE_FORMAT')
          ),
          booster_email_reminder: dose.get('booster_email_reminder'),
          booster_reminder_address: dose.get('booster_reminder_address'),
          comment: dose.get('comment')
        };
      })
    );
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /dose Create a new dose
 * @apiName CreateDose
 * @apiGroup Dose
 *
 * @apiSuccess {Number}   vaccine_id id of the vaccine
 * @apiSuccess {Date}     date_taken Date when the dose was taken
 * @apiSuccess {Date}     [booster_due_date] Date when the booster dose is due
 * @apiSuccess {Boolean}  [booster_email_reminder=false] Has user subscribed for booster email reminder
 * @apiSuccess {String}   [booster_reminder_address] Email address where booster email is sent
 * @apiSuccess {String}   [comment] User's comment for the dose, e.g. place taken
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
        // TODO
 *     }
 */
router.post('/', async (req, res, next) => {
  try {
    let {
      vaccine_id,
      date_taken,
      booster_due_date,
      booster_email_reminder,
      booster_reminder_address,
      comment
    } = req.body;
    log.debug(`Create a new dose`);

    // Parse dates and boolean
    date_taken = moment(date_taken, config.get('DATE_FORMAT'));
    booster_due_date = moment(booster_due_date, config.get('DATE_FORMAT'));
    booster_email_reminder = booster_email_reminder ? true : false;

    let dose = await DoseService.createDose(
      req.user.id,
      vaccine_id,
      date_taken,
      booster_due_date,
      booster_email_reminder,
      booster_reminder_address,
      comment
    );
    if (dose != null) {
      log.info(`New dose created`, { id: dose.id, name: dose.name });
      return res.status(200).json({
        id: dose.id
      });
    } else {
      log.info(`Unable to create a dose`);
      next(createError(400));
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
