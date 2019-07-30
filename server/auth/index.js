const router = require('express').Router()
const { session, driver } = require('../db')
const {saltAndHash, deSalt} = require('./saltAndHash')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password

    //check if user exists
    let query = `
    MATCH (u:user)
    WHERE u.username = {username}
    RETURN u`

    let response = await session.run(query, { username: username })
    let user = response.records[0]._fields[0].properties

    const pw = user.salt ? deSalt(password, user.salt) : password

    query = `MATCH (u:user)
      WHERE u.username = {username} and u.password = {pw}
      RETURN u`

    response = await session.run(query, { username: username, password: pw })

    // All PW should be salted... keeping for now just in case
    // else if (!user.salt) {
    //   //seed file user without salted pw
    //   query = `MATCH (u:user)
    //     WHERE u.username = {username} and u.password = {password}
    //     RETURN u`

    //   response = await session.run(query, { username, password })
    // }

    user = response.records[0]._fields[0].properties

    req.login(user, err => (err ? next(err) : res.json(user)))
    driver.close()
  } catch (err) {
    //Will need to update the response message here for wrong un/pw
    if (err.name === 'bad') {
      res.status(401).send('Wrong username or password')
    } else {
      next(err)
    }
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const {password, salt} = saltAndHash(req.body.password)

    const query = `
      CREATE (newuser:user {username: {username}, email: {email}, password: {password}, googleId: '', createdDate: timestamp(), isAdmin: false, salt: {salt}})
      RETURN newuser
    `

    const response = await session.run(query, { username: username, email: email, password: password, salt: salt})

    const user = response.records[0]._fields[0].properties
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    //Will need to update the response message here for duplicate users
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('user already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
