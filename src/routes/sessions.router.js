const { Router } = require ('express')
const { userModel } = require('../db/models/user.model')
const { createHash } = require ('../utils/hashBcrypt')
const passport = require('passport')


const router = Router()

// router.post('/register', async (req,res)=>{
//     const {first_name, last_name, email, password} = req.body
//     const userNew ={
//         first_name,
//         last_name,
//         email,
//         password: createHash(password)
//     }
// })
// const result = await userModel.create(userNew)

// res.status(200).send({
//     status: 'success',
//     usersCreate: result
// })
// router.post('/login', async (req,res)=>{
//     const {email,password} = req.body
//     const userNew = {
//         email,
//         password
//     }
//     const result = await userModel.create(userNew)
//     res.status(200).send({
//         status: 'success',
//         usersCreate: result
//     })
// })
// routes/sessionRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no existente' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Guardar el usuario en la sesión
    req.session.user = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
    };

    res.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
