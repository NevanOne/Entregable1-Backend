const generateProducts = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push({
            _id: `product_${i}`,
            name: `Product ${i}`,
            price: Math.floor(Math.random() * 100) + 1, // Precio aleatorio entre 1 y 100
            // Agregar campos de ser necesario
        });
    }
    return products;
};

// Handler de la ruta '/mockingproducts' para entregar productos de ejemplo
export const mockingProductsHandler = (req, res) => {
    const products = generateProducts();
    res.json(products);
};