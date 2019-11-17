'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('Users', {
      fields: ['username'],
      unique: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('Users', ['username']);
  }
};
