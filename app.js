const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');
const app = express();
const httpServer = http.createServer(app);
const io = SocketIO(httpServer);
const passport = require("passport");
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const products = require('./src/dao/productManager.js');
const ProductManager = require('./src/dao/productManager.js');
const productManager = new ProductManager(); // Se define productManager aca
const dotenv = require('dotenv').config({path:'./env.production'})

const paymentRoutes = require('./src/routes/paymentRoutes.js');

// Configuración de middleware del payment
app.use(express.json());
app.use('/payment', paymentRoutes);

const {initializePassport} = require("./src/db/models/passport.config.js")
 // import { initializePassport } from './src/db/models/passport.config.js';
 const router = require("./src/routes/mockingRoutes.js")
// import router from './src/routes/mockingRoutes.js';
const mockingRoutes = require("./src/routes/mockingRoutes.js")
// import mockingRoutes from './src/routes/mockingRoutes.js'; //Import de Mocking

// Conexión a mongoose
mongoose.connect('mongodb+srv://Gabriel1998:Gabriel1998@coderhouse.lpjfxh1.mongodb.net/')
// +srv://GabrielAlfonzo:lqNrawLlPkiVUh0o@coderhouse-cluster.h3mubya.mongodb.net/?retryWrites=true&w=majority')


// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine({
    extname: '.handlebars',
    defaultLayout: 'home', 
    layoutsDir: path.join(__dirname, 'views/'), // Vistas
    partialsDir: path.join(__dirname, 'views/partials') 
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

//inicialización productsrouter
const productsRouter = express.Router();

// Ruta para la vista home que lista todos los productos
app.get('/home', async (req, res) => {
    try {
        const allProducts = await productManager.getProducts();
        res.render('home', { products: allProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos: ' + error.message });
    }
});
app.set('views', path.join(__dirname, 'views'));

const verificarProductos = (req, res, next) => {
    if (products.getProducts().length >= 10) {
        next();
    } else {
        res.status(500).json({ error: 'No hay suficientes productos creados' });
    }
};

app.use('/api/products', productsRouter);
// Manejo de WebSockets
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


app.use(session({
    store:MongoStore.create({
        // mongoUrl cluster viejo: 'mongodb+srv://GabrielAlfonzo:lqNrawLlPkiVUh0o@coderhouse-cluster.h3mubya.mongodb.net/?retryWrites=true&w=majority',
        mongoUrl: 'mongodb+srv://Gabriel1998:Gabriel1998@coderhouse.lpjfxh1.mongodb.net/',
        ttl: 30
    }),  
    secret: 'aaaaaaaaa',
    resave: false,
    saveUniinitialized: false,

}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//Mocking Route
router.use('/api', mockingRoutes);

module.exports = router;