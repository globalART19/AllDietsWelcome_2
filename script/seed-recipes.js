'use strict';

const axios = require('axios');
const { recipestore, Recipe } = require('./seed-db');
const { EDAMAM_API_ID, EDAMAM_API_KEY } = require('../secrets');

const apiURI = `https://api.edamam.com/search?app_id=${EDAMAM_API_ID}&app_key=${EDAMAM_API_KEY}`;

const { testResponse } = require('./data/test-response.js');

async function throttleLimit() {
  return new Promise(() => setTimeout(() => {}, 12000));
}

async function seedRecipes() {
  // sync db
  await recipestore.sync();

  console.log(process.argv);
  // if (process.argv.length < 2) {
  //   console.log('start index and max index must be included in command script args');
  //   return;
  // }

  // const startInput = +process.argv[2];
  // const maxInput = +process.argv[3];
  // const q = process.argv[4] || 'burger';
  const q = process.argv[2] || 'burger';
  const from = 0;
  const to = 100;

  // let max = maxInput;
  // let count = startInput;
  // let lastLength = 1;
  // while (count < max && lastLength) {
    // const from = count;
    // const to = count + 99;

    console.log(apiURI, q, from, to)
    const res = await axios.get(apiURI, {
      params: {
        q,
        from,
        to
      }
    });
    // const res = { data: testResponse };
    console.log('data', res.data, 'hits length:', res.data.hits.length)

    // if (res.data.count < max) max = res.data.count;

    const recipes = await Promise.all(
      res.data.hits.map(h => {
        return Recipe.upsert({
          id: h.recipe.uri.split('#')[1],
          searchTerm: q,
          recipe: JSON.stringify(h.recipe),
          label: h.recipe.label,
          image: h.recipe.image,
          url: h.recipe.url,
          ingredients: h.recipe.ingredients.map(ingred => ingred.food)
        });
      })
    );

    console.log(`successfully seeded ${recipes.length} more recipes!`);

    // console.log('start', count, 'max', max, 'count', count + 100, 'length', recipes.length)

    // count += 100;
    // lastLength = recipes.length;

    // api throttling delay
    // await throttleLimit();
  // }

  console.log('done seeding')
};

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seedRecipes();
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
module.exports = seedRecipes;
