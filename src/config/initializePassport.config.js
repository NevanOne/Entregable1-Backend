const passport = require ('passport')
const {Strategy, ExtractJwt } = require('passport-jwt')
const JWTStrategy = Strategy
const ExtractJWT = ExtractJwt

const initializePassport = ()=> {
    const cookieExtractor = (req) =>{
        let token = null
        if (req&& req.cookies) {
            token = req.cookies['cookieToken']
        }
    }
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:'KeyPrivad@Coderhouse123'
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }
    ))
}

module.exports = {
    initializePassport
}