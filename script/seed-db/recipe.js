const Sequelize = require('sequelize');
const { db } = require('./seed-db');

const Recipe = db.define('recipe', {
  search: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  recipe: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

module.exports = Recipe;
