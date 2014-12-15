"use strict";

module.exports = function(sequelize, DataTypes) {
  var beer = sequelize.define("beer", {
    dbid: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.beer.hasMany(models.user, {through: 'usersbeers'});
      }
    }
  });

  return beer;
};
