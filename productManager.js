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

// Crear una instancia de ProductManager
const products = new ProductManager();

// Mostrar los productos (debe devolver un arreglo vacío [])
console.log(products.getProducts());

// Agregar un producto
console.log(products.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}));

// Mostrar los productos nuevamente (ahora debería aparecer el producto recién agregado)
console.log(products.getProducts());

// Obtener un producto por ID (reemplaza 'id_especificado' por el ID del producto)
try {
    console.log(products.getProductById(id_especificado)); // Cambia 'id_especificado' por un ID válido
} catch (error) {
    console.log(error.message);
}

// Actualizar un producto (reemplaza 'id_producto' por el ID del producto y 'updatedFields' por los campos actualizados)
try {
    console.log(products.updateProduct(id_producto, { title: 'Nuevo título' })); // Cambia 'id_producto' por un ID válido y 'updatedFields' según lo necesario
} catch (error) {
    console.log(error.message);
}

// Eliminar un producto (reemplazar 'id_producto' por el ID del producto a eliminar)
try {
    console.log(products.deleteProduct(id_producto)); // Cambiar 'id_producto' por un ID válido
} catch (error) {
    console.log(error.message);
}
