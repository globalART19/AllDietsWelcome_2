let session = require('../server/db/neo')

//i IS THE THING WE ARE LOOKING TO FIND OR CREATE
//n is the node that is making 
//l.type will be connection type ie likes or loves
const mergeQuery = `MERGE (i:Ingriedient {name: {item.name}})`

let node; //this will be the node we create
const makeConnections = async (node) => {
  
  node.associations.forEach((item) => {
    let relationType = 
    let newIngridient = `MATCH (n:Ingridiant {name: {item.name}}
      MERGE
      (n:)-
      )`
    //look for the node in the db - if it exists
    //make the connection (likes or loves depending on caps)
    //look for notes and add any as needed
    //else, make the node and make the connection 
    //add notes
  })
  
}
  
  
  
  // data.records.forEach(async (node) => {
  //   const searchName = node._fields[0].properties.name
  //   const slug = makeSlug(searchName)
  //   const query = `MATCH (n)
  //     WHERE n.name = {searchName}
  //     SET n.slug = {slug}`
  //   const response = await session.run(query, {searchName, slug})
  //  })
