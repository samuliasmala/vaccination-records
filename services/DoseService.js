const log = require('../utils/logger');
const { Dose, Vaccine } = require('../models');
const { getChangedFields, formatDate } = require('../utils/utils');

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

async function getDose(userId, doseId, raw = false) {
  log.debug('Getting a single dose', { doseId });
  let dose = await Dose.findOne({
    where: {
      id: doseId,
      user_id: userId
    },
    include: [{ model: Vaccine }],
    raw: raw
  });
  return dose;
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

async function updateDose(userId, doseId, newData) {
  let dose = await getDose(userId, doseId);

  if (dose == null) {
    throw new Error(`Dose ${doseId} not found!`);
  }

  let doseRaw = dose.get({ plain: true });

  // Parse dates and boolean
  newData.date_taken = formatDate(newData.date_taken);
  newData.booster_due_date = formatDate(newData.booster_due_date);
  doseRaw.date_taken = formatDate(doseRaw.date_taken);
  doseRaw.booster_due_date = formatDate(doseRaw.booster_due_date);
  if (newData.booster_email_reminder != null) {
    newData.booster_email_reminder =
      newData.booster_email_reminder == true ||
      newData.booster_email_reminder === 'true'
        ? true
        : false;
  }

  let newFields = getChangedFields(
    [
      'vaccine_id',
      'date_taken',
      'booster_due_date',
      'booster_email_reminder',
      'booster_reminder_address',
      'comment'
    ],
    newData,
    doseRaw
  );

  if (Object.entries(newFields).length > 0) {
    log.debug('Updating dose', { newFields });
    await dose.update(newFields);
  }

  let status = {};
  for (let i in newFields) {
    status[i] = true;
  }

  return status;
}

module.exports = {
  getAllDoses,
  getDose,
  updateDose,
  createDose
};
