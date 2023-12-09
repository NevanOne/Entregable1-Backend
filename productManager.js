class ProductManager {
    constructor() {
      this.products = [];
    }
  
    getProducts() {
      return this.products;
    }
    addProduct(product){
       if(!product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.code ||
        !product.stock)
    {
 return 'Faltan llenar campos'
    
}
const result = this.products.find( prod => prod.code === product.code)

if (result){
     return 'Ya existe un producto con ese codigo'
}

if (this.products.length === 0) {
    product.id = 1
    this.products.push(product)
}
else{
   product.id = this.products.length + 1
   this.products.push (product)
   return 'Producto agregado'
}
}

getProductById(pid){
    const result= this.products.find(prod => prod.id === pid) 
    if (!result) {
        return 'No existe el producto'
    }
    return result
}
    }

const products = new ProductManager()
console.log(products.addProduct({title: 'producto 1' , description: 'descripción', price: 1000, thumbnail: 'imagen' , stock : 150 , code: 1}))
console.log(products.getProducts())
console.log(products.getProductById())
