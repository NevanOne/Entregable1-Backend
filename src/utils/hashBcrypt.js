const bcrypt = require('bcrypt')
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
const isValidPassword = (password, userFoundDB) => bcrypt.compareSync(password, userFoundDB.password)

module.exports = { 
    createHash,
    isValidPassword
}
