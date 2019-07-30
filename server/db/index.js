const neo4j = require('neo4j-driver').v1
const { DEV_NEO4J_UN, DEV_NEO4J_PW} = require('../../secrets')
const Sequelize = require('sequelize')
const pkg = require('../../package.json')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    logging: false
  }
)

const graphenedbURL = process.env.GRAPHENEDB_BOLT_URL || 'bolt://localhost:7687'
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || DEV_NEO4J_UN
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD || DEV_NEO4J_PW

const driver = neo4j.driver(
  graphenedbURL,
  neo4j.auth.basic(graphenedbUser, graphenedbPass)
)

const session = driver.session()

module.exports = { db, session, driver }

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close())
}
