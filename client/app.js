import React from 'react'

import {Navbar} from './components'
import Routes from './routes'
import styled from 'styled-components'
import cp from './color-palette'

const Container = styled.div`
  height: 100%;
`

const App = () => {
  return (
    <Container>
      <Navbar />
      <Routes />
    </Container>
  )
}

export default App
