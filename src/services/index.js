const { 
    UserDao, 
    ProductDao, 
    OrderDao, 
    CartDao 
} = require('../dao/factory/factory.js') 

const ProductRepositories = require('../repository/product.repositories.js') // Services
const UserRepository = require('../repository/userRepository.js')
const OrderRepositories = require('../repository/orders.repository.js')
const CartRepositories = require('../repository/cart.repositories.js')

const userService = new UserRpositories(new UserDao())
const productService = new ProductRepositories(new ProductDao())
const cartService = new CartRepositories(new CartDao())
const orderService = new OrderRepositories(new OrderDao())

module.exports = {
    userService,
    productService,
    cartService,
    orderService
}

// Parte socket práctica.

// const socket = io();
// socket.emit('message', 'Hola ! Me comunico desde un websocket')
// socket.on('evento_para_socket_individual',data=>{
//     console.log(data);
// })

// socket.on('evento_para_todos_menos_el_socket_actual',data=>{
//     console.log(data);
// })
// socket.on('evento_para_todos',data=>{
//     console.log(data);
// })
