'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dose = sequelize.define('Dose', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    vaccine_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    date_taken: DataTypes.DATE,
    booster_due_date: DataTypes.DATE,
    booster_email_reminder: DataTypes.BOOLEAN,
    booster_reminder_address: DataTypes.STRING,
    comment: DataTypes.TEXT
  }, {});
  Dose.associate = function(models) {
    Dose.belongsTo(models.User, {
      foreignKey: 'user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Dose.belongsTo(models.Vaccine, {
      foreignKey: 'vaccine_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Dose;
};
