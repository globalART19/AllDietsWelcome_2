import styled from 'styled-components'

const ipsom = "Nori grape beet broccoli kombu beet greens fava bean potato celery. Black-eyed pea prairie turnip leek lentil reens parsnip. lettuce water chestnut eggplant leek soko chicory celtuce parsley jícama salsify."

const ItemDescriptionBox = styled.div`
  position: relative;
  flex-direction: column;
  height: 100px;
  overflow: auto;
  padding: 15px 0 0 15px;


  .title {
    position: relative;
    font-weight: 400;
    font-size: 1.7em;
    margin: 0;
    text-align: center;
  }
  .description {
    position: relative;
    font-weight: 200;
    font-size: .75em;
    margin: 0 15px;
  }
`

const Lock = styled.i`
font-size: 2em;
background-color: white;
color: lightgray;
height: 30px;
width: 30px;
border-radius: 50px;
padding: 10px;
margin: 0 15px 0 0;
align-self: center;
  @media (max-width: 350px) {
    font-size: 1em;
    height: 10px;
    width: 10px;
  }
`

const Panel = styled.div`
  height: 100px;
  width: 95vw;
  max-width: 800px;
  margin: 3px;
  display: flex;
  justify-content: space-between;
  overflow: auto;
  background-color: white;
  background-color: #E5FFEA;
  box-shadow: 1px 2px lightgray;
  border-radius: 5px;
  @media (max-width: 350px) {
    height: 50px
  }
  `
  //background-color: #E5FFEA;

module.exports = { ipsom, ItemDescriptionBox, Panel, Lock }
