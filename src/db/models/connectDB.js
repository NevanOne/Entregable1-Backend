const mongoose = require("mongoose")
const dotenv = require ('dotenv')
const {program} = require ("../utils/commander")
const MongoSingleton = require("../utiles/mongoSingleton")

const { mode } = program.opts()
console.log(mode)
dotenv.config({
    
})
exports.connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://GabrielAlfonzo:lqNrawLlPkiVUh0o@coderhouse-cluster.h3mubya.mongodb.net/?retryWrites=true&w=majority')
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}