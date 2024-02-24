const jwt = require ('jsonwebtoken')
exports.PRIVATE_KEY = 'KeyPrivad@Coderhouse123'

exports.generateToken =  user => jwt.sign(user, this.PRIVATE_KEY, {
    expiresIn:'1d'})