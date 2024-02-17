const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const path = require('path');
const ProductManager = require('./ProductManager'); // productmanager never read
const handlebars = require('express-handlebars');

const app = express();
const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

import passport from 'passport';
import { initializePassport } from './src/db/passport.config';

// Conexión a mongoose
mongoose.connect('mongodb+srv://GabrielAlfonzo:<password>@coderhouse-cluster.h3mubya.mongodb.net/?retryWrites=true&w=majority',(error)=>{
    if(error){
        console.log("No se puede conectar a la base de datos"+error)
        process.exit()
    }
})

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine({
    extname: '.handlebars',
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, 'views/layouts'), // Directorio de layouts
    partialsDir: path.join(__dirname, 'views/partials') 
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

//inicialización productsrouter
const productsRouter = express.Router();

// Ruta para la vista home que lista todos los productos
app.get('/home', (req, res) => {
    const allProducts = products.getProducts();
    res.render('home', { products: allProducts });
});


// Manejo de rutas para productos
productsRouter.get('/', (req, res) => {
    const allProducts = products.getProducts();
    res.json(allProducts);
});

productsRouter.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    try {
        const foundProduct = products.getProductById(productId);
        res.json(foundProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
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



productsRouter.get('/', verificarProductos, (req, res) => {
    const limit = parseInt(req.query.limit);
    const allProducts = products.getProducts();

    if (limit) {
        res.json(allProducts.slice(0, limit));
    } else {
        res.json(allProducts);
    }
});

productsRouter.get('/:id', verificarProductos, (req, res) => {
    const productId = parseInt(req.params.id);
    try {
        const foundProduct = products.getProductById(productId);
        res.json(foundProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productsRouter.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const product = {
        title,
        description,
        code,
        price: parseFloat(price),
        status: true,
        stock: parseInt(stock),
        category,
        thumbnails: thumbnails || []
    };

    try {
        const result = products.addProduct(product);
        res.json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

    // Emitir el nuevo producto a todos los clientes
    io.emit('newProduct', product);
});

productsRouter.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    try {
        const result = products.updateProduct(productId, updatedFields);
        res.json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const result = products.deleteProduct(productId);
        res.json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

    // Emitir a los clientes que un producto fue eliminado
    io.emit('productDeleted', productId);
});

app.use('/api/products', productsRouter);

const cartsRouter = express.Router();

cartsRouter.get('/:cid', (req, res) => {
    res.json({ message: `Obtener los productos del carrito con ID ${req.params.cid}` });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    res.json({ message: `Agregar el producto con ID ${req.params.pid} al carrito con ID ${req.params.cid}` });
});

app.use('/api/carts', cartsRouter);

// Ruta para la vista que lista los productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { /* datos para la vista si es necesario */ });
});

// Manejo de WebSockets
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.use(session({
    store:MongoStore.create({
        mongoUrl: 'mongodb+srv://GabrielAlfonzo:lqNrawLlPkiVUh0o@coderhouse-cluster.h3mubya.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: {useNewUrl},
        ttl: 30
    }),  
    secret: 'aaaaaaaaa',
    resave: false,
    saveUniinitialized: false,

}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

