require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { userModel } = require('../models/user.model'); 


const mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
  console.error('MONGO_URL is not defined in .env file');
  process.exit(1);
}

async function createAdmin() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(mongoURL);

    // Verificar si ya existe un usuario admin
    const existingAdmin = await userModel.findOne({ email: 'admin@admin.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Crear el usuario admin
    const hashedPassword = await bcrypt.hash('admin', 10); // Contraseña: admin
    const admin = new userModel({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@admin.com', // Usuario: admin
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    // Cerrar la conexión
    mongoose.connection.close();
  }
}

createAdmin();
