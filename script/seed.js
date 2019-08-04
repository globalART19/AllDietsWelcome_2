'use strict';

const { db, session } = require('../server/db');
const { User } = require('../server/db/models');
const { createDiet, createIngredient, connectIngredients } = require('./seeder');
const { ingredientSeed, categorySeed, dietSeed } = require('./data/node-seed-data');

async function seed() {
  // clear DBs for seeding
  await db.sync({force: true});
  console.log('db synced and cleared!');
  await session.run(`
    MATCH (n)
    DETATCH DELETE n
  `);
  console.log('graph db synced and cleared!');

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ]);

  console.log(`seeded ${users.length} users`);

  await Promise.all(dietSeed.forEach(diet => createDiet(diet)));
  console.log('seeded diet nodes');

  await Promise.all(categorySeed.forEach(category => createCategory(category)));
  console.log('seeded category nodes');

  await Promise.all(ingredientSeed.forEach(ingredient => createIngredient(ingredient)));
  console.log('seeded ingredient nodes');

  await Promise.all(connectIngredients.forEach(ingredient => connectIngredients(ingredient)));
  console.log('seeded connections for ingredients');

  console.log(`seeded successfully`);
};

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
};

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
