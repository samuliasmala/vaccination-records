'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      password_hash: {
        allowNull: false,
        type: DataTypes.STRING
      },
      default_reminder_email: DataTypes.STRING,
      year_born: DataTypes.INTEGER
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['username']
        }
      ]
    }
  );
  User.associate = function(models) {
    User.hasMany(models.Dose, {
      foreignKey: 'user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Vaccine, {
      foreignKey: 'created_by_user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
