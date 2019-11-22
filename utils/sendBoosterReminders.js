const moment = require('moment-timezone');

const log = require('./logger');
const config = require('../config');
const mailgun = require('./mailgun');
const { Dose, User, Vaccine } = require('../models');

function sendBoosterReminders(checkFrequencyMins) {
  log.info('Doint the initial booster reminder check');
  checkAndSendBoosterReminders();
  log.debug(
    `Setting booster reminder check for every ${checkFrequencyMins} minutes`
  );
  setInterval(checkAndSendBoosterReminders, 1000 * 60 * checkFrequencyMins);
}

async function checkAndSendBoosterReminders() {
  try {
    log.debug('Checking for booster reminders');
    let doses = await Dose.findAll({
      where: {
        booster_email_reminder: true
      },
      include: [{ model: User }, { model: Vaccine }]
    });

    for (const dose of doses) {
      let date = moment(dose.get('booster_due_date'));

      if (date.isValid()) {
        // Send reminder if booster date closer than specified warning time
        let reminderDaysBefore = dose.User.get('reminder_days_before_due');
        if (reminderDaysBefore == null) {
          reminderDaysBefore = 30;
        }
        if (moment().diff(date, 'days') >= reminderDaysBefore) {
          let msg = {
            to: dose.get('booster_reminder_address'),
            subject: `Remember to take your booster vaccine!`,
            text: `Hello from Vaccination eRecord!

The next booster dose for ${
              dose.Vaccine.name
            } vaccination is due on ${date.format(config.get('DATE_FORMAT'))}.

You are receiving this email because you've subscribed to booster dose reminder at https://www.rokotuskortti.com. You won't receive another reminder for this booster dose.

Best regards,
The Vaccination eRecord team`
          };
          log.info(`Sending booster reminder email to ${msg.to}`);
          log.debug(`Full message content`, msg);
          await mailgun.send(msg);
          log.debug('Updating database for the sent reminder');
          await dose.update({ booster_email_reminder: false });
        }
      }
    }
  } catch (err) {
    log.error('Error in checking and sending booster remingers', {
      error: err
    });
  }
}

module.exports = sendBoosterReminders;
