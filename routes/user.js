var express = require('express');
var router = express.Router();

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

module.exports = router;
