// This setup taken from https://github.com/code-map/capstone-1804/blob/master/server/db/neo.js
const neo4j = require('neo4j-driver').v1
const { DEV_NEO4J_UN, DEV_NEO4J_PW} = require('../../secrets')

const graphenedbURL = process.env.GRAPHENEDB_BOLT_URL || 'bolt://localhost:7687'
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || DEV_NEO4J_UN
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD || DEV_NEO4J_PW

const driver = neo4j.driver(
  graphenedbURL,
  neo4j.auth.basic(graphenedbUser, graphenedbPass)
)

const session = driver.session()

module.exports = { session, driver }
