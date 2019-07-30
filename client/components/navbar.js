import React from 'react'
import styled from 'styled-components'

const About = styled.div`
display: inline-block;
font-weight: 400;
font-size: .85em;
max-width: 600px;
min-width: 258px;
padding: 0;
margin: 0;
@media (max-width: 841px) {
  margin: 0 15px;
}
`

const BrandName = styled.div`
  display: inline-block;
  margin: 0 15px;
  padding: 0;
  font-weight: 700;
  font-size: 4em;

  .red {
    color: #FF0C39;
  }
  .yellow {
    color: #FFEE00;
  }
  .green {
    color: #28FF82;
    color: #446637;
    color: #CE2D4F;
  }
  .aqua {
    color: #13457F;
  }
  .pink {
    color: #FFACA3;
  }
`

const Navbar = () => (
      <div>
        <BrandName>
            <span className="red">F</span>
            <span className="aqua">L</span>
            <span className="yellow">V</span>
            <span className="green">R</span>
            <span className="pink">S</span>
        </BrandName>
        <About>Spark your culinary ideas with combinations of harmonious ingredients.  Pick a starting item, and see all of the verified combinations.  There are no wrong answers here.</About>
      </div>)


export default Navbar


