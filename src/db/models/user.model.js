const mongoose = require("mongoose");
const userCollection = 'usuarios';
const bcrypt = require('bcrypt');

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
    password: { type: String, required: false },

    role: { type: String, enum: ['user', 'admin'], default: 'user' } // Añadir campo de rol


})
// Pre-save hook para hash la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar la contraseña ingresada con la almacenada
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model(userCollection, userSchema);

module.exports={
    userModel,
}