'use strict';

const axios = require('axios');
const { recipestore, Recipe } = require('./seed-recipestore');
const { EDAMAM_API_ID, EDAMAM_API_KEY } = require('/secrets')

const apiURI = `https://api.edamam.com/search?app_id=${EDAMAM_API_ID}&app_key=${EDAMAM_API_KEY}`

async function seed() {
  // sync db
  await recipestore.sync({force: true});

  console.log(process.argv);
  if (process.argv.length < 2) {
    console.log('start index and max index must be included in command script args');
    return;
  }

  const start = process.argv[0];
  const max = process.argv[1];
  const q = process.argv[2] || 'burger';

  let count = start;
  let lastLength = 1;
  while (count < max || !lastLength) {
    const from = start;
    const to = start + 100;

    const data = await axios.get(apiURI, {
      params: {
        q,
        from,
        to
      }
    });
    const recipes = await Promise.all(
      data.hits.map(recipe => {
        return Recipe.create({ search, recipe: JSON.stringify(recipe.recipe) });
      })
    );

    console.log(`successfully seeded ${recipes.length} more recipes!`);

    count += 100;
    // lastLength = recipes.length;
    lastLength = 0;

    console.log('start', start, 'max', max, 'count', count, 'length', recipes.length, 'recipes', recipes)
  }
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
    await recipestore.close();
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