const jwt = require ('jsonwebtoken')
exports.PRIVATE_KEY = 'KeyPrivad@Coderhouse123'

// crear la funcion que genera el token llamada generateToken
const generateToken = ({user={}, expiresIn='24'}) => {
    const token = jwt.sign(user, jwt_private_key, {expiresIn})
    return token
}

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    
    if (!authHeader) return res.status(401).send({status: 'error',error: 'Not Authenticated'})

    const token = authHeader.split(' ')[1]
    jwt.verify(token, jwt_private_key, (err, credentials) => {
        if (err) return res.status(403).send({status: 'error',error: 'Not Authenticated'})

        req.user = credentials.user
        
        next()
    })
}

module.exports = {
    generateToken,
    authToken
}