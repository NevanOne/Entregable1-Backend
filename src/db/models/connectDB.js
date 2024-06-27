const mongoose = require("mongoose")
const dotenv = require ('dotenv')
const {program} = require ("../../utils/commander")
const MongoSingleton = require("../../config/MongoSingleton")

const { mode } = program.opts()
console.log(mode)
dotenv.config({
    
})
exports.connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Gabriel1998:Gabriel1998@coderhouse.lpjfxh1.mongodb.net/')
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}