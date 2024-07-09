const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require('dotenv').config();

const MongoSingleton = require('./src/config/MongoSingleton.js');
const authRoutes = require('./src/routes/auth.routes.js');
const mockingRoutes = require("./src/routes/mockingRoutes.js");
const paymentRouter = require('./src/routes/payments.router.js')
const app = express();
const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

const cors = require('cors');
app.use(cors());

// Conexión a MongoDB utilizando MongoSingleton
MongoSingleton.getInstance();

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine({
    extname: '.handlebars',
    defaultLayout: '',
    layoutsDir: path.join(__dirname, 'src/views'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middleware para el manejo de JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 30
    }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambiar a true en producción si se usa HTTPS
        maxAge: 1000 * 60 * 60 * 2 // 2 horas de vida de la cookie
    }
}));

// Inicialización de Passport
const { initializePassport } = require("./src/db/models/passport.config");
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/payments', paymentRouter);
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/api/sessions', authRoutes);
app.use('/api', mockingRoutes);

// Ruta de logout
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

// Ruta de vistas
app.get('/home', async (req, res) => {
    try {
        const allProducts = await productManager.getProducts();
        res.render('home', { products: allProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos: ' + error.message });
    }
});

// Ruta de perfil
app.get('/profile', requireAuth, (req, res) => {
    // Acceder a los datos del usuario desde la sesión
    const user = req.session.user;
    res.render('profile', { user });
});

// Otras rutas de vistas
const viewRoutes = [
    { path: '/chat', view: 'chat' },
    { path: '/login', view: 'login' },
    { path: '/register', view: 'register' },
    { path: '/profile', view: 'profile' },
    { path: '/realtimeproducts', view: 'realTimeProducts' },
    { path: '/index', view: 'index' }
];

viewRoutes.forEach(route => {
    app.get(route.path, (req, res) => {
        res.render(route.view);
    });
});

// Manejo de WebSockets
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Ruta de autenticación GitHub
app.get('/auth/github',
    passport.authenticate('github'));

app.get('/api/sessions/githubcallback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // Autenticación exitosa
        req.session.user = req.user; // Guardar el usuario en la sesión
        res.redirect('/profile');
    });

function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // Redirigir al login si no está autenticado
}

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
