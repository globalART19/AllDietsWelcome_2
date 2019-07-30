/* eslint-disable complexity */
/* eslint-disable max-statements */
const { session, db } = require('./index');

const createDiet = async (name, isInclude) => {
  return null;
};

const nodeBuilder = async (node) => {
  await session.run(
    `MERGE (i:Ingredient {name: $name})
      ON CREATE SET i.note=$note, i.general=$general
      ON MATCH SET i.note=$note, i.general=$general`,
      { name: node.ingredient, note: node.note, general: node.general}
  );

  await Object.keys(node).forEach(async prop => {
    const propCap = prop[0].toUpperCase() + prop.substring(1);
    const propVal = node[prop];
    switch(propCap) {
      case 'Technique':
        await propVal.forEach(async value => {
          await session.run(
            `
            MATCH (i:Ingredient {name: $iname})
            MERGE (p:Technique {value: $value})
            MERGE (i)-[:PROP]->(p)
            `,
            { value, iname: node.ingredient }
          );
        });
        break;
      case 'Season':
        await session.run(
          `MATCH (i:Ingredient {name: $iname})
          MERGE (t:Season {value: $propVal})
          MERGE (i)-[:PROP]->(t)`,
          { propVal, iname: node.ingredient }
        )
        break
      case 'Taste':
        await session.run(
          `MATCH (i:Ingredient {name: $iname})
          MERGE (t:Taste {value: $propVal})
          MERGE (i)-[:PROP]->(t)`,
          { propVal, iname: node.ingredient }
        )
        break
      case 'Weight':
        await session.run(
          `MATCH (i:Ingredient {name: $iname})
          MERGE (t:Weight {value: $propVal})
          MERGE (i)-[:PROP]->(t)`,
          { propVal, iname: node.ingredient }
        )
        break
      case 'Volume':
        await session.run(
          `MATCH (i:Ingredient {name: $iname})
          MERGE (t:Volume {value: $propVal})
          MERGE (i)-[:PROP]->(t)`,
          { propVal, iname: node.ingredient }
        )
        break
      case 'Function':
        await session.run(
          `MATCH (i:Ingredient {name: $iname})
          MERGE (t:Function {value: $propVal})
          MERGE (i)-[:PROP]->(t)`,
          { propVal, iname: node.ingredient }
        )
        break
      case 'Tips':
        await session.run(
          `MATCH (i:Ingredient {name: $iname})
          MERGE (t:Tips {value: $propVal})
          MERGE (i)-[:PROP]->(t)`,
          { propVal, iname: node.ingredient }
        )
        break
      case 'Botanical relatives':
        await session.run(
          `MATCH (i:Ingredient {name: $iname})
          MERGE (t:BotanicalRelatives {value: $propVal})
          MERGE (i)-[:PROP]->(t)`,
          { propVal, iname: node.ingredient }
        )
        break
      case 'Avoid':
        await session.run(
          `MATCH (i:Ingredient {name: $iname})
          MERGE (t:Avoid {value: $propVal})
          MERGE (i)-[:PROP]->(t)`,
          { propVal, iname: node.ingredient }
        )
        break
      case 'Associations':
          await propVal.forEach(async ingredient => {
            if (typeof ingredient === 'string' && ingredient !== node.ingredient) {
              if (ingredient.toUpperCase() === ingredient) {
                await session.run(
                  `MATCH (i:Ingredient {name: $iname})
                  MERGE (t:Ingredient {name: $ingredient})
                  MERGE (i)-[:BESTWITH]->(t)`,
                  { propVal, iname: node.ingredient, ingredient }
                )
              } else {
                await session.run(
                  `MATCH (i:Ingredient {name: $iname})
                  MERGE (t:Ingredient {name: $ingredient})
                  MERGE (i)-[:PAIRWITH]->(t)`,
                  { propVal, iname: node.ingredient, ingredient: ingredient.toUpperCase() }
                )
              }
            } else if (typeof ingredient === 'object' && Object.keys(ingredient)[0].toUpperCase() !== node.ingredient) {
              const key = Object.keys(ingredient)[0];
              if (key.toUpperCase() === key) {
                await session.run(
                  `MATCH (i:Ingredient {name: $iname})
                  MERGE (t:Ingredient {name: $ingredient})
                  MERGE (i)-[:BESTWITH {type: $type}]->(t)`,
                  { propVal, iname: node.ingredient, ingredient: key, type: ingredient[key] }
                )
              } else {
                await session.run(
                  `MATCH (i:Ingredient {name: $iname})
                  MERGE (t:Ingredient {name: $ingredient})
                  MERGE (i)-[:PAIRWITH {type: $type}]->(t)`,
                  { propVal, iname: node.ingredient, ingredient: key.toUpperCase(), type: ingredient[key] }
                )
              }
            }
          })
        break
      default:
        break
    }
  })
}



module.exports = { nodeBuilder }
