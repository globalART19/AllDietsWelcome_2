import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { addItemToListAction, postItemList } from '../store';
import { IngredientPanel } from './ingredient-panel'
import styled from 'styled-components'



const Board = styled.div`
  height: 600px;
  max-width: 600px;
  min-width: 258px;
  display: flex;
  flex-direction: column;
  margin: 0 0 0 15px

`

const displayedIngredients = [
  { name: 'chicken'},
  { name: 'parsley'},
  { name: 'tomato'},
  { name: 'garlic'},
  { name: 'cumin'}
]


const IngredientBoard = () => {
  //on initial load:
    //this page will have some blank filler panels
    //when the first item is added it goes to the far left
    //the state of the panels is the state of the store
      //the ingridiant list,
    return(<Board>
              {
                displayedIngredients.map(item => { return (
                   <IngredientPanel key={item.name} ingredient={item} />)
                })
              }
          </Board>)
  }





const mapState = state => {
  return {
    displayedIngredients: state.food.ingredientList,
    error: state.user.error
  }
}



export default connect(mapState)(IngredientBoard)

/**
 * PROP TYPES
 */

