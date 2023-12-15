class ProductManager {
    constructor() {
        this.products = [];
    }
  
    getProducts() {
        return this.products;
    }

    addProduct(product){
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock
        ) {
            return 'Faltan llenar campos';
        }

        const result = this.products.find(prod => prod.code === product.code);

        if (result) {
            return 'Ya existe un producto con ese codigo';
        }

        const productId = this.generateProductId();
        product.id = productId;
        this.products.push(product);
        return 'Producto agregado';
    }

    getProductById(pid){
        const result = this.products.find(prod => prod.id === pid);
        if (!result) {
            throw new Error('No existe el producto');
        }
        return result;
    }

    updateProduct(pid, updatedFields){
        const productToUpdate = this.products.find(prod => prod.id === pid);
        if (!productToUpdate) {
            throw new Error('No existe el producto');
        }

        // Update fields except for 'id'
        Object.keys(updatedFields).forEach(key => {
            if (key !== 'id') {
                productToUpdate[key] = updatedFields[key];
            }
        });

        return 'Producto actualizado';
    }

    deleteProduct(pid){
        const index = this.products.findIndex(prod => prod.id === pid);
        if (index === -1) {
            throw new Error('No existe el producto');
        }

        this.products.splice(index, 1);
        return 'Producto eliminado';
    }

    generateProductId() {
        const ids = this.products.map(product => product.id);
        let newId = 1;

        while (ids.includes(newId)) {
            newId++;
        }

        return newId;
    }
}

const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];

        // Se carga la data del archivo cuando se crea una instancia
        this.loadFromFile();
    }

    async loadFromFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            // Si el archivo arroja un error o no existe, se inicializa el array vacio
            this.products = [];
        }
    }

    async saveToFile() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error("Error escribiendo el archivo:", error);
        }
    }

    getProducts() {
        return this.products;
    }

    addProduct(product) {
        const existingProduct = this.products.find(prod => prod.code === product.code);
        if (existingProduct) {
            throw new Error('Ya existe un producto con ese código');
        }

        const productId = this.generateProductId();
        product.id = productId;
        this.products.push(product);
        this.saveToFile();
        return 'Producto agregado';
    }

    getProductById(pid) {
        const product = this.products.find(prod => prod.id === pid);
        if (!product) {
            throw new Error('No existe el producto con el ID especificado');
        }
        return product;
    }

    updateProduct(pid, updatedFields) {
        const productToUpdate = this.products.find(prod => prod.id === pid);
        if (!productToUpdate) {
            throw new Error('No existe el producto con el ID especificado');
        }

        Object.keys(updatedFields).forEach(key => {
            if (key !== 'id') {
                productToUpdate[key] = updatedFields[key];
            }
        });

        this.saveToFile();
        return 'Producto actualizado';
    }

    deleteProduct(pid) {
        const index = this.products.findIndex(prod => prod.id === pid);
        if (index === -1) {
            throw new Error('No existe el producto con el ID especificado');
        }

        this.products.splice(index, 1);
        this.saveToFile();
        return 'Producto eliminado';
    }

    generateProductId() {
        const ids = this.products.map(product => product.id);
        let newId = 1;

        while (ids.includes(newId)) {
            newId++;
        }

        return newId;
    }
}

// Crear una instancia de ProductManager con persistencia de archivos
const filePath = 'products.json';
const products = new ProductManager(filePath);

(async () => {
    try {
        // Mostrar los productos (debe devolver un arreglo vacío [])
        console.log(products.getProducts());

        // Agregar un producto
        await products.addProduct({
            title: 'producto prueba',
            description: 'Este es un producto prueba',
            price: 200,
            thumbnail: 'Sin imagen',
            code: 'abc123',
            stock: 25
        });

        // Mostrar los productos nuevamente (ahora debería aparecer el producto recién agregado)
        console.log(products.getProducts());

        // Obtener un producto por ID (reemplazar 'id_especificado' por el ID del producto)
        const productId = 1; // Reemplazar con el ID válido del producto
        console.log(products.getProductById(productId));

        // Actualizar un producto (reemplazar 'id_producto' por el ID del producto y 'updatedFields' por los campos actualizados)
        const updatedFields = { title: 'Nuevo título' }; // Reemplazar con los campos actualizados
        const productIdToUpdate = 1; // Reemplazar con el ID válido del producto a actualizar
        console.log(await products.updateProduct(productIdToUpdate, updatedFields));

        // Eliminar un producto (reemplazar 'id_producto' por el ID del producto a eliminar)
        const productIdToDelete = 1; // Reemplazar con el ID válido del producto a eliminar
        console.log(await products.deleteProduct(productIdToDelete));
    } catch (error) {
        console.error(error.message);
    }
})();
