'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vaccine = sequelize.define('Vaccine', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    abbreviation: DataTypes.STRING,
    code_id: DataTypes.INTEGER,
    created_by_user_id: DataTypes.INTEGER
  }, {});
  Vaccine.associate = function(models) {
    Vaccine.belongsTo(models.User, {
      foreignKey: 'created_by_user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Vaccine.hasMany(models.Dose, {
      foreignKey: 'vaccine_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Vaccine;
};