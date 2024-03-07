const passport = require('passport');
const local = require('passport-local');
const { userModel } = require('./models/user.model');
const { createHash, isValidPassword } = require('../utils/hashBcrypt');
const jwt = require('jsonwebtoken');
const GitHubStrategy = require('passport-github').Strategy;


const LocalStrategy = local.Strategy;

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
                password: createHash(password)
            };
            let result = await userModel.create(newUser);
            return done(null, result);
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

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                console.log('Usuario no encontrado');
                return done(null, false);
            }
            if (!isValidPassword(password, user.password)) {
                console.log('Contraseña inválida');
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
};

// Función para generar un token JWT
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Autenticación en Github

passport.use(new GitHubStrategy({
    clientID: 831166,
    clientSecret: Iv1.ce12ded8407fa909,
    callbackURL: "http://localhost:3000/api/sessions/githubcallback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      const user = await User.findOne({ githubId: profile.id });
      if (user) {
        return cb(null, user);
      } else {
        const newUser = {
          githubId: profile.id,
          username: profile.username,
          email: profile.emails[0].value 
        };

        const createdUser = await User.create(newUser);
        return cb(null, createdUser);
      }
    } catch (error) {
      return cb(error);
    }
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Autenticación exitosa
    res.redirect('/');
  });
  app.use(passport.initialize());

module.exports = {
    initializePassport,
    generateToken,
    authenticateToken
};
