const { configObject, connectBD } = require("../../db/models/connectDB");

let UserDao
let ProductDao
let CartsDao


// Persistencia Mongo
switch (configObject.persistence) {
    case 'FILE':
        const UserDaoFile = require("../fileManager/userManagerfile")
        UserDao = UserDaoFile


        break;
    case 'MEMORY':
        
        break;

    default:
//linea para import from
        connectBD()

        const UserDaoMongo = require("./Mongo/usersDao.mongo")
        UserDao = UserDaoMongo

        const ProductDaoMongo = require("./Mongo/productsDao.mongo")
        ProductDao = ProductDaoMongo

        break;
}

module.exports = {
    UserDao,
    ProductDao
}