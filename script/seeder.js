/* eslint-disable complexity */
/* eslint-disable max-statements */
const { session } = require('../server/db/index');

const createDiet = async (diet) => {
  return session.run(
    `MERGE (d:Diet {name: $name})
      ON CREATE SET d.type=$type, d.nickname=$nickname
      ON MATCH SET d.type=$type, d.nickname=$nickname`,
    { name: diet.name, nickname: diet.nickname, type: diet.type }
  );
};

const createCategory = async (category) => {
  return session.run(
    `MERGE (c:Category {name: $name})`,
    { name: category.name }
  );
};

const createIngredient = async (ingredient) => {
  return session.run(
    `MERGE (i:Ingredient {name: $name})`,
      { name: ingredient.ingredient }
  );
};

const connectIngredients = async (node) => {
  // Connect ingredient to category
  await node.categories.forEach(cat => {
    session.run(
      `
      MATCH (i:Ingredient {name: $ingredient})
      MERGE (c:Category {name: $category})
      MERGE (i)-[:PROP]->(c)
      `,
      { ingredient: node.ingredient, category: cat}
    )
  });

  // connect ingredient to diets
  await node.diets.forEach(diet => {
    session.run(
      `
      MATCH (i:Ingredient {name: $ingredient})
      MERGE (d:Diet {name: $diet})
      MERGE (i)-[:IN]->(d)
      `,
      { ingredient: node.ingredient, diet }
    );
  })

  return;
}

module.exports = { createDiet, createCategory, createIngredient, connectIngredients }
