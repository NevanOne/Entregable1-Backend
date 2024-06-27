const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars')
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require('dotenv').config

const app = express();
const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

const ProductManager = require('./src/dao/productManager.js');
const productManager = new ProductManager();

const paymentRoutes = require('./src/routes/paymentRoutes.js');
const authRoutes = require('./src/routes/auth.routes.js');
const mockingRoutes = require("./src/routes/mockingRoutes.js");

// Conexión a MongoDB
mongoose.connect('mongodb+srv://Gabriel1998:Gabriel1998@coderhouse.lpjfxh1.mongodb.net/');

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
        mongoUrl: 'mongodb+srv://Gabriel1998:Gabriel1998@coderhouse.lpjfxh1.mongodb.net/',
        ttl: 30
    }),
    secret: 'aaaaaaaaa',
    resave: false,
    saveUninitialized: false,
}));

// Inicialización de Passport
const { initializePassport } = require("./src/db/models/passport.config");
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Usar rutas
app.use('/payment', paymentRoutes);
app.use('/auth', authRoutes);
app.use('/api', mockingRoutes);


// Ruta para la vista home que lista todos los productos
app.get('/home', async (req, res) => {
    try {
        const allProducts = await productManager.getProducts();
        res.render('home', { products: allProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos: ' + error.message });
    }
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/index', (req, res) => {
    res.render('index');
});



// Ruta de ejemplo para verificar si las rutas de autenticación funcionan
app.get('/auth', (req, res) => {
    res.status(200).json({ message: 'Ruta de autenticación funcionando' });
});

// Ruta de ejemplo para verificar si las rutas de pago funcionan
app.get('/payment', (req, res) => {
    res.status(200).json({ message: 'Ruta de pago funcionando' });
});

// Ruta de ejemplo para verificar si las rutas de mocking funcionan
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Ruta de mocking funcionando' });
});

// Manejo de WebSockets
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

