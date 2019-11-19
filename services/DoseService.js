const log = require('../utils/logger');
const { Dose, Vaccine } = require('../models');

async function getAllDoses(userId) {
  log.debug('Getting all doses');
  let doses = await Dose.findAll({
    where: {
      user_id: userId
    },
    include: [{ model: Vaccine }],
    order: [['createdAt', 'DESC']]
  });
  return doses;
}

async function createDose(
  user_id,
  vaccine_id,
  date_taken,
  booster_due_date,
  booster_email_reminder,
  booster_reminder_address,
  comment
) {
  log.debug('Creating a new dose');
  let dose = await Dose.create({
    vaccine_id,
    date_taken,
    booster_due_date,
    booster_email_reminder,
    booster_reminder_address,
    comment,
    user_id
  });
  return dose;
}

module.exports = {
  getAllDoses,
  createDose
};
