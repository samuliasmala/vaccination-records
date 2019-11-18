const { Op } = require('sequelize');

const log = require('../utils/logger');
const { Vaccine } = require('../models');

async function getAllVaccines(userId) {
  log.debug('Getting all vaccines');
  let vaccines = await Vaccine.findAll({
    where: {
      [Op.or]: [{ created_by_user_id: null }, { created_by_user_id: userId }]
    },
    order: [
      ['created_by_user_id', 'DESC'],
      ['id', 'ASC']
    ]
  });
  return vaccines;
}

async function createVaccine(name, abbreviation, userId) {
  log.debug('Creating a new vaccine', { name });

  let vaccine = await Vaccine.create({
    name: name,
    abbreviation: abbreviation,
    created_by_user_id: userId
  });
  return vaccine;
}

module.exports = {
  getAllVaccines,
  createVaccine
};
