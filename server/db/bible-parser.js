/* eslint-disable complexity */
/* eslint-disable max-statements */
const fs = require('fs');
const {nodeBuilder} = require('./seeder')

const searchMap = {
  Season: true,
  Taste: true,
  Weight: true,
  Volume: true,
  Function: true,
  Techniques: true,
  Tips: true,
  'Botanical relatives': true,
  Avoid: true,
  Weather: true
}

const skipConditions = (line) => {
  return (
    line.slice(0, 2) === '* ' ||
    line.indexOf('Dishes') !== -1 ||
    line.toLowerCase().indexOf(' i ') !== -1 ||
    line.toLowerCase().indexOf(' you ') !== -1 ||
    line.toLowerCase().indexOf(' we ') !== -1 ||
    line.toLowerCase().indexOf(' is ') !== -1 ||
    line.slice(0, 1) == '-'
  )
}

const ingredientChecker = (bookArray, index) => {
  const line = bookArray[index]
  if (!line) return false
  const checkLength = line.slice(0, line.indexOf(' ')).length > 1
  const checkCaps = line.slice(0, line.indexOf(' ')).toUpperCase() === line.slice(0, line.indexOf(' '))
  const checkColon = bookArray[index + 1] && bookArray[index + 1].indexOf(':') !== -1
  const checkMap = bookArray[index + 1] && !!searchMap[bookArray[index + 1].slice(0, bookArray[index + 1].indexOf(':'))]
  const hasSee = line.indexOf('(See') !== -1
  const nextCaps = bookArray[index + 1] && bookArray[index+1].slice(0, bookArray[index+1].indexOf(' ')).toUpperCase() === bookArray[index+1].slice(0, bookArray[index+1].indexOf(' '))
  if (checkCaps && hasSee && nextCaps) return true
  return checkLength && checkCaps && checkColon && checkMap && !skipConditions(line)
}

const parseIngredientName = (line) => {
  let note = ''
  let name = line
  let general = false
  if( line.indexOf('(See') !== -1 ) {
    name = line.slice(0, line.indexOf(' (See'))
    note = line.slice(line.indexOf('(See') + 1, line.indexOf(')'))
  }
  if (name.toUpperCase().indexOf(' — IN GENERAL') !== -1) {
    name = name.slice(0, name.indexOf(' — IN GENERAL'))
    general = true
  }
  return { name: name.trim(), note, general}
}

const cheeseParser = (line) => {
  const label = line.slice(0, line.indexOf(':')).toLowerCase()
  if(label === 'cheese') {
    const cheeseArray = line.slice(line.indexOf(':') + 2).split(', ')
    return cheeseArray.map(cheese => cheese.toLowerCase())
  }
  return false
}

const pushAssociation = (associations, newItemName, notes) => {
  const updatedArray = [...associations]
  const lastItem = updatedArray[updatedArray.length - 1]
  if (lastItem && lastItem[`${newItemName}`]) {
    lastItem[`${newItemName}`].push(notes)
  } else {
    updatedArray.push({ [`${newItemName}`]: [notes]})
  }
  return updatedArray
}

const parseBible = async (err, data) => {
  if (err) throw err;
  const bookArrayRaw = data.split(/[\r\n]+/)
  const bookArray = bookArrayRaw.filter(item => item.length > 1)

  let ingredientObject = {}
  let associations = []

  const reviewItemsArray = []
  let i = 0
  let skipOne = false
  while (i < bookArray.length) {
    const line = bookArray[i]
    let type = 'Ingredient'

    if (ingredientChecker(bookArray, i)) {
      const parsedName = parseIngredientName(line)
      ingredientObject.ingredient = parsedName.name
      ingredientObject.note = parsedName.note
      ingredientObject.general = parsedName.general

      if (['SPRING', 'WINTER', 'AUTUMN', 'SUMMER'].includes(ingredientObject.ingredient)) {
        type = 'Season'
      }

      i++
      while (bookArray[i] !== undefined && bookArray[i].indexOf(':') !== -1) {
        if (bookArray[i].length) {
          const colonIndex = bookArray[i].indexOf(':')
          const label = bookArray[i].slice(0, colonIndex)
          if (label === 'Techniques') {
            ingredientObject[label.toLowerCase()] = bookArray[i].slice(colonIndex + 2).split(', ')
          } else if (searchMap[label]) {
            ingredientObject[label.toLowerCase()] = bookArray[i].slice(colonIndex + 2)
          }
        }
        i++
      }

      while (bookArray[i] !== undefined && !ingredientChecker(bookArray, i)) {
        if (bookArray[i].slice(0, bookArray[i].indexOf(' ')).length > 1) {
          if (bookArray[i + 1] !== undefined && bookArray[i + 1].startsWith('— ')) {
            i++
          } else if (skipConditions(bookArray[i])) {
            //Skip these lines
          } else if (bookArray[i].indexOf(', esp.') !== -1) {
            const associationLabel = bookArray[i].slice(0, bookArray[i].indexOf(', esp.'))
            const notes = bookArray[i].slice(bookArray[i].indexOf(', esp.') + 7)
            associations = pushAssociation(associations, associationLabel, notes)
          } else if (bookArray[i].toLowerCase().indexOf(' and ') !== -1) {
            const splitItems = bookArray[i].split(/\sand\s/i)
            // eslint-disable-next-line no-loop-func
            splitItems.forEach(item => {
              associations.push(item)
            })
          } else if (bookArray[i].indexOf(':') !== -1) {
            let cheeseArray = cheeseParser(bookArray[i])
            if (cheeseArray) {
              associations.push({ cheese: cheeseArray })
            } else if (type === 'Season') {
              const hasPeak = bookArray[i].indexOf(' (peak: ') !== -1
              const associationLabel = hasPeak ? bookArray[i].slice(0, bookArray[i].indexOf(' (peak: ')) : bookArray[i]
              if (hasPeak) {
                const peak = bookArray[i].slice(bookArray[i].indexOf(' (peak: ') + 8, -1)
                associations.push({ [`${associationLabel}`]: peak })
              } else {
                associations.push(associationLabel)
              }
            } else {
              const associationLabel = bookArray[i].slice(0, bookArray[i].indexOf(':'))
              const notes = bookArray[i].slice(bookArray[i].indexOf(':') + 2)
              associations = pushAssociation(associations, associationLabel, notes)
            }
          } else if (bookArray[i].indexOf('(') !== -1) {
            const associationLabel = bookArray[i].slice(0, bookArray[i].indexOf('('))
            const notes = bookArray[i].slice(bookArray[i].indexOf('(') + 2)
            associations = pushAssociation(associations, associationLabel, notes)
          } else if (bookArray[i].indexOf(',') !== -1) {
            const associationLabel = bookArray[i].slice(0, bookArray[i].indexOf(','))
            const notes = bookArray[i].slice(bookArray[i].indexOf(',') + 2)
            if (type === 'Season') {
              console.log('skipped', bookArray[i], 'for now')
            } else {
              associations = pushAssociation(associations, associationLabel, notes)
            }
          } else if (bookArray[i] === 'Flavor Affinities') {
            const faArray = []
            i++
            while (bookArray[i] && bookArray[i].indexOf('+') > 0) {
              faArray.push(bookArray[i])
              i++
              skipOne = true
            }
            associations.push({ 'Flavor Affinities': faArray })
          } else if (bookArray[i] && bookArray[i].indexOf('*') === 0) {
            associations.push(bookArray[i].slice(1))
          } else {
            associations.push(bookArray[i])
          }
        }
        if (!skipOne) {
          i++
        }
        skipOne = false
        if (!associations) {
          // console.log(ingredientObject.ingredient, associations, 'associations fail')
        } else if (associations.length && associations[associations.length - 1].length > 40) {
          reviewItemsArray.push({ [`${ingredientObject.ingredient}`]: associations[associations.length - 1] })
        }
      }
      ingredientObject.associations = associations

      if (Object.keys(ingredientObject).length > 2) {
        console.log(ingredientObject)
        await nodeBuilder(ingredientObject, type)
      }

      ingredientObject = {}
      associations = []
    } else {
      i++
    }
  }
  reviewItemsArray.forEach(reviewItem => {
    console.log('reviewItem: ', reviewItem)
  })
  return
}

const readFiles = async () => {
  await fs.readFile('./veggiebible_flavors.txt', 'utf8', async (err, data) => await parseBible(err, data))
  console.log('ready to parse veggie bible')
  await fs.readFile('./bible.txt', 'utf8', async (err, data) => await parseBible(err, data))
  console.log('seeding complete')
  return
}

readFiles();
