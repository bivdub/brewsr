"use strict";
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'please enter a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 1000],
          msg: 'please enter a password that is at least 6 characters long.'
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.hasMany(models.beer, {through: 'usersbeers'});
      }
    },
    hooks: {
      beforeCreate: function(data, garbage, callback) {
        bcrypt.hash(data.password, 13, function(error, hash) {
          data.password = hash;
          callback(null, data)
        });
      }
    }
  });
  return user;
};
