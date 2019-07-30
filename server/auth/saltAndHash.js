const crypto = require('crypto')

const saltAndHash = (pw) => {
  const salt = crypto.randomBytes(16).toString('base64')
  const password = crypto
    .createHash('RSA-SHA256')
    .update(pw)
    .update(salt)
    .digest('hex')
  return {salt, password}
}

const deSalt = (password, salt) => crypto
  .createHash('RSA-SHA256')
  .update(password)
  .update(salt)
  .digest('hex')

  module.exports = {saltAndHash, deSalt}
