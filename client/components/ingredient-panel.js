import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { addItemToListAction, postItemList } from '../store';
import { ipsom, Panel, ItemDescriptionBox, Lock } from "./panel-styles";


export const IngredientPanel = ({locked=false, ingredient}) => {

  return(
      <Panel>
        <ItemDescriptionBox>
            <span className="title">{ingredient.name}</span>
            <p className="description">{ipsom}</p>
        </ItemDescriptionBox>
        {
          locked ? <Lock className="fas fa-lock"/> : <Lock className="fas fa-unlock-alt"/>
        }
      </Panel>)
}










// const mapState = state => {
//   return {
//     ingredientList: state.food.ingredientList,
//     error: state.user.error
//   }
// }

// const mapDispatch = dispatch => {
//   return {
//     handleSubmit: (evt, ingredientList) => {
//       evt.preventDefault()
//       dispatch(postItemList(ingredientList))
//     },
//     addItemToList: item => {
//       console.log('additemtolist', item)
//       dispatch(addItemToListAction(item))
//     }
//   }
// }

// export default connect(mapState, mapDispatch)(IngredientPanel)

/**
 * PROP TYPES
 */

