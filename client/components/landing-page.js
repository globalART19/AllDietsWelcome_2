import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import styled from 'styled-components'
import cp from '../color-palette'

/**
 * STYLING
 */
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${cp.background};
  color: ${cp.text};
`

const Highlight = styled.div`
  background-color: ${cp.highlight};
  height: 100px;
  width: 100px;
  margin: 5px;
  text-align: center;
  border-radius: 2em;
  padding: 1em;
`
const Lowlight = styled.div`
  background-color: ${cp.lowlight};
  height: 100px;
  width: 100px;
  margin: 5px;
  text-align: center;
  border-radius: 2em;
  padding: 1em;
`
const Main = styled.div`
  background-color: ${cp.main};
  height: 100px;
  width: 100px;
  margin: 5px;
  text-align: center;
  border-radius: 2em;
  padding: 1em;
`

const Text = styled.div`
  background-color: ${cp.text};
  color: ${cp.highlight};
  height: 100px;
  width: 100px;
  margin: 5px;
  text-align: center;
  border-radius: 2em;
  padding: 1em;
`

const FlexyDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

/**
 * COMPONENT
 */
export const LandingPage = () => {

  return (
    <Container>
      <h3>Welcome to All Diets Welcome!!</h3>
      <FlexyDiv>
        <Highlight>Highlight</Highlight>
        <Lowlight>Lowlight</Lowlight>
        <Main>Main</Main>
        <Text>Text</Text>
      </FlexyDiv>
    </Container>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(LandingPage)

/**
 * PROP TYPES
 */
LandingPage.propTypes = {
  email: PropTypes.string
}
