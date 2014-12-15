"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("usersbeers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER
      },
      beerId: {
        type: DataTypes.INTEGER
      },
      elo: {
        type: DataTypes.INTEGER
      },
      lastrated: {
        type: DataTypes.BIGINT
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("usersbeers").done(done);
  }
};