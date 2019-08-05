const Sequelize = require('sequelize');

const recipestore = new Sequelize(
  'postgres://localhost:5432/adwrecipestore',
  {
    logging: false
  }
);

module.exports = recipestore;

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => recipestore
.close());
}
