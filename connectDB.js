const mongoose = require("mongoose")

exports.connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://GabrielAlfonzo:lqNrawLlPkiVUh0o@coderhouse-cluster.h3mubya.mongodb.net/?retryWrites=true&w=majority')
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}