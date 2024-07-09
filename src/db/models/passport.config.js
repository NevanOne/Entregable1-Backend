const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { userModel } = require('./user.model');

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, email, password, done) => {
        const { first_name, last_name } = req.body;
        try {
            let user = await userModel.findOne({ email });
            if (user) return done(null, false);

            let newUser = {
                first_name,
                last_name,
                email,
                password: password
            };
            let result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                console.log('Usuario no encontrado');
                return done(null, false);
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                console.log('Contraseña inválida');
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findOne({ _id: id });
        done(null, user);
    });
};

// Autenticación en Github
const GitHubStrategy = require('passport-github2').Strategy;

passport.use('github', new GitHubStrategy({
    clientID: "Iv1.ce12ded8407fa909",
    clientSecret: "81bc9bc2f1a9de41bbfaef8cee820d47bb3a103b",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('profile', profile)
    try {
      let user = await userModel.findOne({email: profile._json.email})
      if(!user){
        let newUser = {
          first_name: profile.username,
          last_name: profile.username,
          email: profile._json.email,
          password: ''
        }
        let result = await userModel.create(newUser)
        return done(null, result)
      }
      return done(null, user)
    } catch (error) {
      done(error)
    }
  }))
  
module.exports = {
    initializePassport,
};
