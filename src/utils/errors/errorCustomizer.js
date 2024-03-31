
// Diccionario de errores comunes
const errorDictionary = {
    'product_not_found': 'Producto no encontrado',
    'cart_full': 'El carrito está lleno',
    'no_stock': 'No hay stock del producto seleccionado'
    // Agregar errores en caso de ser necesario
};

// Función para personalizar errores
export const customizeError = (errorCode) => {
    return errorDictionary[errorCode] || 'Error desconocido';
};
