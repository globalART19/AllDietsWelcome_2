const Sequelize = require('sequelize');
const recipestore = require('./recipe-store');

const Recipe = recipestore.define('recipe', {
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
