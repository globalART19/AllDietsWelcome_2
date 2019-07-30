import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const ADD_ITEM_TO_LIST = 'ADD_ITEM_TO_LIST';
const GET_ITEM_LIST = 'GET_ITEM_LIST';
const REMOVE_ITEM_FROM_LIST = 'REMOVE_ITEM_FROM_LIST';
const UPDATE_TOTAL_INGREDIENTS = 'UPDATE_TOTAL_INGREDIENTS';
const UPDATE_FUZZY_LEVEL = 'UPDATE_FUZZY_LEVEL';
// locked items are the items that searches will be based on
const LOCK_ITEM = 'LOCK_ITEM';
// item stays in the displayed items list until more random matches are generated
const UNLOCK_ITEM = 'UNLOCK_ITEM';
// random matches will correspond to the displayed items
const ADD_MATCHES = 'ADD_MATCHES';
// This will happen when the original search item is cleared
const CLEAR_ITEMS = 'CLEAR_ITEMS';

/**
 * INITIAL STATE
 */
// THE COMBINATION OF THESE TWO LISTS IS THE DISPLAYED ITEMS
const initialState = {
  // This is the starting ingredient plus any locked items
  lockedItems: [],
  // this will be where the generated matches go
  unlockedItems: []
};

/**
 * ACTION CREATORS
 */

export const lockItemAction = item => {
  return ({ type: LOCK_ITEM, item });
}

export const unlockItemAction = item => {
  return ({ type: UNLOCK_ITEM, item });
}

export const clearItemsAction = () => {
  return ({ type: CLEAR_ITEMS })
}
export const addItemToListAction = item => {
  console.log('action item', item);
  return ({ type: ADD_ITEM_TO_LIST, item });
}
export const removeItemFromListAction = item => {
  console.log('action item', item);
  return ({ type: REMOVE_ITEM_FROM_LIST, item });
}
export const updateTotalIngredientsAction = qty => {
  console.log('action item', qty);
  return ({ type: UPDATE_TOTAL_INGREDIENTS, qty });
}
export const updateFuzzyLevelAction = level => {
  console.log('action item', level);
  return ({ type: UPDATE_FUZZY_LEVEL, level });
}
const postIngredientsAction = ingredientList => ({ type: GET_ITEM_LIST, displayedIngredients: ingredientList });
const getIngredientAction = ingredientList => ({ type: GET_ITEM_LIST, displayedIngredients: ingredientList});

export const addMatchesAction = list => {
  return ({ type: ADD_MATCHES, list });
}


/**
 * THUNK CREATORS
 */
// export const postItemListThunk = ingredientList => async dispatch => {
//   try {
//     const res = await axios.post('/api/convert', ingredientList);
//     console.log('converted list response: ', res);
//     const list = res.data.matchedIngredients;
//     dispatch(postIngredientsAction(list));
//     // history.push('/login')
//   } catch (err) {
//     console.error(err);
//   }
// }
export const getIngredientListThunk = (ingredientList, totalIngredients, fuzzyLevel) => async dispatch => {
  try {
    const parsedList = ingredientList.map(item => item.name)
    const res = await axios.get('/api/convert', {
      params: {
        ingredientList: parsedList.join(','),
        totalIngredients,
        fuzzyLevel
      }
    });
    console.log('converted list response: ', res);
    const list = res.data.matchedIngredients;
    dispatch(getIngredientAction(list));
    // history.push('/login')
  } catch (err) {
    console.error(err);
  }
}

export const getMatchesThunk = (ingredientList, totalIngredients, fuzzyLevel) => async dispatch => {
  dispatch(addMatchesAction(['this is a list of items']));
  // try {
  //   const parsedList = ingredientList.lockedItems.map(item => item.name)
  //   const res = await axios.get('/api/convert', {
  //     params: {
  //       ingredientList: parsedList.join(','),
  //       totalIngredients,
  //       fuzzyLevel
  //     }
  //   });
  //   console.log('converted list response: ', res);
  //   const list = res.data.matchedIngredients;
  //   dispatch(addMatchesAction(list));
  //   history.push('/login')
  // } catch (err) {
  //   console.error(err);
  // }
}

// export const getMatchesThunk = (lockedItems) => async dispatch => {
//   try {
//     const ingridiantList = lockedItems.map(item => item.name)
//     const res = await axios.post('/api/convert', { ingridiantList });
//     const list = res.data.matchedIngredients;
//     dispatch(generateMatchesAction(list));
//     history.push('/login')
//   } catch (err) {
//     console.error(err);
//   }
// }

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_ITEM_TO_LIST:
      return { ...state, lockedItems: [...state.lockedItems, action.item]};
    case REMOVE_ITEM_FROM_LIST:
      return { ...state, lockedItems: state.lockedItems.filter(item => item.name !== action.item.name) };
    case GET_ITEM_LIST:
      return { ...state, displayedIngredients: action.displayedIngredients};
    case UPDATE_TOTAL_INGREDIENTS:
      return { ...state, totalIngredients: action.qty };
    case UPDATE_FUZZY_LEVEL:
      return { ...state, fuzzyLevel: action.level };
    case LOCK_ITEM:
      console.log('locked item ', action.item)
      return { ...state, lockedItems: [...state.lockedItems, action.item]};
    case UNLOCK_ITEM:
      console.log('unlocked item ', action.item)
      //return { ...state, lockedItems: state.lockedItems.filter(item => item.name !== action.item.name),
      //          unlockedItems: [...state.unlockedItems, action.item ]};
    case ADD_MATCHES:
      console.log('matches ', action.list)
      //return { ...state, unlockedItems: action.list };
    case CLEAR_ITEMS:
      console.log('cleared')
      //return { ...state, lockedItems: [], unlockedItems: [] };
    default:
      return state
  };
};
