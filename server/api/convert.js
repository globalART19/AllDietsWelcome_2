const router = require('express').Router()
const { session } = require('../db')
const { parseNeo4j } = require('../helpers/parse-neo4j')
module.exports = router


const queryCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

const buildComboMatchString = (size, comboString = '', index = 0) => {
  if(index === 0) {
    comboString = `MATCH (${queryCharacters[size]}:Ingredient)`;
  }
  for (let i = index; i < size; i++) {
    comboString = `${comboString} MATCH (${queryCharacters[index]})--(${queryCharacters[i + 1]})`;
  }
  if (index >= size) {
    return {
      comboMatchString: comboString,
      resultVar: queryCharacters[size]
    };
  }
  return buildComboMatchString(size, comboString, index + 1)
}

const buildIngredientQuery = (ingredientList, totalIngredients, fuzzyLevel) => {
  const matchIngredientFuzzy = (name, x) => `MATCH (${x}:Ingredient) WHERE ${x}.name CONTAINS '${name.toUpperCase()}'`;
  const matchIngredientExact = (name, x) => `MATCH (${x}:Ingredient {name:'${name.toUpperCase()}'})`;

  let searchVars = ''
  console.log('fuzzyLevel', fuzzyLevel)
  const matchString = ingredientList.reduce((endQuery, item, index) => {
    let queryString = '';
    if (fuzzyLevel === 0 || (fuzzyLevel <= 1 && !endQuery)) {
      queryString = endQuery + ' ' + matchIngredientExact(item, queryCharacters[index])
    } else if (fuzzyLevel === 1) {
      queryString = endQuery + ' ' + matchIngredientFuzzy(item, queryCharacters[index]);
    } else {
      queryString = endQuery + ' ' + matchIngredientFuzzy(item, queryCharacters[index]);
    }

    searchVars += `${queryCharacters[index]},`;
    return queryString.trim();
  }, '');

  const {comboMatchString, resultVar} = buildComboMatchString(ingredientList.length);

  const randomizeString = `WITH ${searchVars} ${resultVar}, rand() as randomizer ORDER BY randomizer`

  const limitNumber = totalIngredients - ingredientList.length;
  console.log('limitNumber', limitNumber)
  const returnString = `RETURN DISTINCT ${searchVars} ${resultVar} LIMIT ${limitNumber}`

  const query = `${matchString} ${comboMatchString} ${randomizeString} ${returnString}`

  return query;
}

router.get('/', async (req, res, next) => {
  try {
    const { ingredientList, totalIngredients, fuzzyLevel } = req.query;

    const totalIngredientsNumber = +totalIngredients;
    const fuzzyLevelNumber = +fuzzyLevel;

    const ingredientListArray = ingredientList.split(',').map(item => item.toUpperCase());
    let comparator = [...ingredientListArray];
    let match = [];
    const cache = req.session.ingredientList || [];

    console.log('ingredientListArray', ingredientListArray)
    if (comparator.length === cache.length) {
        match = comparator.filter(item => cache.some(cacheItem => item.toUpperCase() === cacheItem));
    }

    let fullList = [];
    if (comparator.length === match.length) {
      console.log('query in session')
      fullList = [...req.session.matchedIngredients];
    } else {
      const query = buildIngredientQuery(ingredientListArray, totalIngredientsNumber, fuzzyLevelNumber);
      console.log('query: ', query)
      const results = await session.run(query);
      matchedIngredients = parseNeo4j(results.records);
      console.log('matchedIngredients: ', matchedIngredients)
      req.session.ingredientList = ingredientListArray;
      req.session.matchedIngredients = [...matchedIngredients];
    }
    res.json({ matchedIngredients });
  } catch (err) {
    next(err);
  }
})

// router.post('/', async (req, res, next) => {
//   try {
//     const { ingredientList } = req.body;
//     const totalReturn = 5;
//     let comparator = [...ingredientList];
//     const cache = req.session.ingredientList || [];

//     if (comparator.length === cache.length) {
//       while (comparator.length) {
//         const match = comparator.filter(item => cache.some(cacheItem => item.name === cacheItem.name));
//         if (match.length === comparator.length) {
//           comparator = [];
//         } else {
//           comparator = match;
//         }
//       }
//     }

//     let fullList = [];
//     if (comparator.length === 0) {
//       fullList = [...req.session.matchedIngredients];
//     } else {
//       const query = buildIngredientQuery(ingredientList);
//       const results = await session.run(query);
//       fullList = parseNeo4j(results.records);
//       req.session.ingredientList = ingredientList;
//       req.session.matchedIngredients = [...fullList];
//     }
//     const matchedIngredients = [];
//     for (let i = 0; i < totalReturn - ingredientList.length; i++) {
//       let j = Math.round(Math.random() * fullList.length);
//       matchedIngredients.push(fullList[j])
//       fullList = [...fullList.slice(0, j), ...fullList.slice(j+1)]
//     }
//     res.json({matchedIngredients});
//   } catch (err) {
//     next(err);
//   }
// })
