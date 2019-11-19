const express = require('express');
const createError = require('http-errors');
const router = express.Router();

const log = require('../utils/logger');

const VaccineService = require('../services/VaccineService');

/**
 * @api {get} /vaccine Get List of vaccines
 * @apiName GetVaccines
 * @apiGroup Vaccine
 * @apiPermission logged in
 * @apiDescription Get list of all built-in vaccines from THL and also new
 * vaccines created by the user making the request
 *
 * @apiSuccess {Object[]} vaccines List of vaccines
 * @apiSuccess {Number}   vaccines.id id of the vaccine
 * @apiSuccess {String}   vaccines.name Name of the vaccine
 * @apiSuccess {String}   vaccines.abbreviation Abbreviation of the vaccine
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
        [
            {
                "id": 48,
                "name": "Kolerarokote",
                "abbreviation": "Cholera"
            },
            {
                "id": 49,
                "name": "Haemophilus influenzae tyyppi b -rokote",
                "abbreviation": "Hib"
            }
        ]
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
    let vaccines = await VaccineService.getAllVaccines(req.user.id);
    return res.status(200).json(
      vaccines.map(v => {
        return {
          id: v.get('id'),
          name: v.get('name'),
          abbreviation: v.get('abbreviation')
        };
      })
    );
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /vaccine Create a new vaccine
 * @apiName CreateVaccine
 * @apiGroup Vaccine
 *
 * @apiParam {String}   name Name of the vaccine
 * @apiParam {String}   abbreviation Abbreviation of the vaccine
 *
 * @apiParamExample {json} Request-Example:
{
  "name": "Test vaccination",
  "abbreviation": "test"
}
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "id": 5
 *     }
 */
router.post('/', async (req, res, next) => {
  try {
    let { name, abbreviation } = req.body;
    log.debug(`Create a new vaccine`, { name, abbreviation });
    let vaccine = await VaccineService.createVaccine(
      name,
      abbreviation,
      req.user.id
    );
    if (vaccine != null) {
      log.info(`New vaccine created`, { id: vaccine.id, name: vaccine.name });
      return res.status(200).json({
        id: vaccine.id
      });
    } else {
      log.info(`Unable to create a vaccine`);
      next(createError(400));
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
