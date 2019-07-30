import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { addItemToListAction, removeItemFromListAction,getIngredientListThunk, updateTotalIngredientsAction, updateFuzzyLevelAction } from '../store';
import { SearchTools, IngredientPanel, IngredientBoard } from './';
import styled from 'styled-components'

const Input = styled.input`
  background: transparent;
  border: none;
  width: 300px;
  border-bottom: 1px solid #000000;
  font-size: 1.7em;
  font-family: 'Montserrat', sans-serif;
  :focus {
    outline:0;
  }
`
const Form = styled.form`

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0 20px 15px;
`

const ContentContainter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
//possible button color #FF7E70;

const Button = styled.button`
  background-color: Transparent;
  height: 30px;
  border-radius: 12px;
  font-size: 200;
  border: solid black 1px;
  margin: 0 15px 0 0;
  box-shadow: 0 2px lightgray;
  :hover {
    border: solid #FF3A93 1px;
    color: #FF3A93;
  }
  :active {
    background-color: #FF3A93;
    color: yellow;
    font-weight: 400;
    box-shadow: 0 1px #666;
    transform: translateY(2px);
  }
  :focus {
    outline:0;
  }
`

const Buttons = styled.div`
  display: flex;
  margin: 5px 0 0 0;
  align-self: flex-end;
  @media (max-width: 822px) {
    align-self: flex-start;
  }
`
const InputItems = styled.div`
  display: flex;
  justify-content: center;
  margin: 0;
  @media (max-width: 822px) {
    flex-direction: column;
  }
`

const Label = styled.label`
  font-size: 1.7em;
  font-weight: 200;
  margin: 0 10px 0 0;
`


/**
 * COMPONENT
 */
export class ConversionForm extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      foodItem: '', // this is the starting ingredient;
      totalIngredients: 5,
      fuzzyLevel: 1
      // there has to be some way to lock down the items;
    }
  }

  componentDidMount() {
    const searchString = this.props.location.search;
    if (searchString) {
      let currentIndex = searchString.indexOf('foodItem=') + 9;
      const ingredientList = searchString.slice(
        currentIndex,
        searchString.indexOf('&') === -1 ? undefined : searchString.indexOf('&')
      ).split(',');

      currentIndex = searchString.indexOf('totalIngredients=', currentIndex) + 17;
      const totalIngredients = currentIndex > 16 ?
        searchString.slice(
          currentIndex,
          searchString.indexOf('&', currentIndex) === -1 ? undefined : searchString.indexOf('&', currentIndex)
        ) : this.state.totalIngredients;

      currentIndex = searchString.indexOf('fuzzyLevel=', currentIndex) + 11;
      const fuzzyLevel = currentIndex > 10 ?
        searchString.slice(
          currentIndex,
          searchString.indexOf('&', currentIndex) === -1 ? undefined : searchString.indexOf('&', currentIndex)
        ) : this.state.fuzzyLevel;

      const objectIngredientList = ingredientList.map(item => {
        const ingredient = { name: item };
        this.props.addItemToList(ingredient);
        return ingredient;
      });

      this.props.updateTotalIngredients(totalIngredients);
      this.props.updateFuzzyLevel(fuzzyLevel);

      this.props.getIngredientList(objectIngredientList, totalIngredients, fuzzyLevel);
    }
  }

  handleChange = evt => {
    const prevState = {...this.state};
    this.setState({
      ...prevState,
      [evt.target.name]: evt.target.value
    });
  }

  handleAddItem = async () => {
    const prevState = { ...this.state };
    await this.props.addItemToList({name: this.state.foodItem});
    await this.handleSubmit()
    this.setState({
      ...prevState,
      foodItem: ''
    });
  }

  handleSubmit = (evt) => {
    evt && evt.preventDefault();
    this.props.getIngredientList(this.props.lockedItems, this.state.totalIngredients, this.state.fuzzyLevel);
  }

  render() {
    const { displayedIngredients, handleSubmit, error } = this.props
    return (
      <ContentContainter>
        <Form onChange={this.handleChange} onSubmit={(evt) => handleSubmit(evt)} name='search'>
          <InputItems>
            <Label htmlFor="foodItem">Starting Ingredient : </Label>
            <Input name="foodItem" type="text" value={this.state.foodItem} />
          </InputItems>
          <Buttons>
            <Button>RANDOMIZE FLAVOR</Button>
            <Button type='button' className="add" onClick={this.handleAddItem}>ADD</Button>
            <Button type='button' className="add" onClick={this.handleClearItem}>CLEAR</Button>
          </Buttons>
          {this.state.foodItem}
        </Form>
        <IngredientBoard/>
      </ContentContainter>
    )
  }
}

const mapState = state => {
  return {
    displayedIngredients: state.food.displayedIngredients,
    lockedItems: state.food.lockedItems,
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    getIngredientList: (lockedItems, totalIngredients, fuzzyLevel) => {
      console.log('getIngredientList', lockedItems, totalIngredients, fuzzyLevel)
      dispatch(getIngredientListThunk(lockedItems, totalIngredients, fuzzyLevel))
    },
    addItemToList: item => {
      console.log('additemtolist', item)
      dispatch(addItemToListAction(item))
    },
    removeItemFromList: item => {
      console.log('removeitemfromlist', item)
      dispatch(removeItemFromListAction(item))
    },
    updateTotalIngredients: qty => {
      console.log('updateTotalIngredients', qty)
      dispatch(updateTotalIngredientsAction(qty))
    },
    updateFuzzyLevel: level => {
      console.log('updateFuzzyLevel', level)
      dispatch(updateFuzzyLevelAction(level))
    }
  }
}

export default connect(mapState, mapDispatch)(ConversionForm)

/**
 * PROP TYPES
 */
ConversionForm.propTypes = {
  displayedIngredients: PropTypes.array,
  // handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
