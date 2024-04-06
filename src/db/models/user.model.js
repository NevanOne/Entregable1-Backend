const mongoose = require("mongoose")
const userCollection = 'usuarios'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email:{
        type: String,
        unique: true,
    },
    age: Number, // Campo de edad
    gender: {
        type: String,
        enum: ['male', 'female', 'other'] // Enumeracion para género
    },
    phone:{
        type: String,
        unique: true,
    }  // Campo de numero de teléfono

})

const userModel = mongoose.model(userCollection, userSchema);

module.exports={
    userModel,
}