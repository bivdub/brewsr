"use strict";

module.exports = function(sequelize, DataTypes) {
  var usersbeers = sequelize.define("usersbeers", {
    userId: DataTypes.INTEGER,
    beerId: DataTypes.INTEGER,
    elo: DataTypes.INTEGER,
    lastrated: DataTypes.BIGINT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.usersbeers.belongsTo(models.beer);
      }
    }
  });

  return usersbeers;
};
