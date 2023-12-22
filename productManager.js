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
            // Si el archivo arroja un error o no existe, se inicializa el array vacío
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

        const existingProduct = this.products.find(prod => prod.code === product.code);
        if (existingProduct) {
            return 'Ya existe un producto con ese código';
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

module.exports = ProductManager;
