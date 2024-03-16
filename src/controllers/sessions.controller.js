const { userModel } = require("../db/models/user.model")
const { logger } = require("../middleware/logger")
const { userService, cartService } = require("../services")
const { createHash, isValidPassword } = require("../utils/bcryptPass")
const { generateToken } = require("../utils/jwt")

class AuthController {
    

    registerUser = async (req, res)=>{ // Base de Datos
        try {
            const { first_name, last_name, email, password } = req.body

            // Validación de datos
            if (!first_name || !last_name || !email || !password) return res.status(400).send({status: 'error', error: 'Values incomplete'})
            
            const exists = await userService.getUser(email)

            if (exists) return res.status(401).send({status: 'error', message: 'El usuario ya existe'})

            let cart = await cartService.createCart(email)
            const hashedPassword = createHash(password)

            const newUser = {
                first_name,
                last_name,
                email,
                cartId: cart._id,
                password: hashedPassword
            }
            let result = await userService.createUser(newUser)   
            if (!result) return res.status(400).send({status: 'error', message: 'Error al crear el usuario'})         

            res.status(200).send({result})
        } catch (error) {
            logger.error(error)
        }
    }

    loginUser =  async (req, res)=>{
        const { email, password} = req.body    
        if (!email || !password) return res.status(400).send({status: 'error', error: 'Values incomplete'})
    
        const user = await userService.getUser(email)

        if (!user) return res.status(401).send({status: 'error', error: 'No se encuentra el usuario'})

        if (!user.cartId) {
            // Si no tiene un carrito, crea uno nuevo
            let newCart = await cartService.createCart(email)
      
            // Asocia el ID del carrito al usuario
            user.cartId = newCart._id;
            await user.save();
        }
        
        const isValidPass = isValidPassword(user, password)

        if (!isValidPass) return res.status(401).send({status: 'error', error: 'Usuario o contraseña incorrectos'})

        // Generar token de usuario
        const { first_name, last_name, role } = user
        const token = generateToken({ user:{
            first_name,
            last_name, 
            email,
            role
        }, expiresIn: '24h'})

        res.cookie('token', token, {
            httpOnly: true, maxAge: 1000 * 60 * 60 * 24
        }).send({status:'success', token, cid: user.cartId._id})
    }

    logoutUser = async (req, res)=>{
        try {      
            res.clearCookie('token')
            res.status(200).redirect('/login')
        } catch (error) {
            logger.info(error)
        }
    }

    forgotPassword = async (req, res)=>{
        try {
            
            const { email } = req.body
            
            // buscar el usuario en la base de datos
            const {_doc: doc} = await userModel.findOne( {email})
            const {password, _id, ...user} = doc        
            logger.info(user)
            if (!user) return res.status(400).send({status: 'error', message: 'Usuario Inexistente'})
        
            // generar un token para el usuario
            const token = generateToken({user, expiresIn: '4h'})
            const subject = 'Restablecer contraseña'
            const html = `
                            <p> Hola ${user.first_name}, </p>
                            <p> Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                            <a href="${base_url}/api/session/reset-password/${token}">Restablecer contraseña</a>
                            <p>Este enlace expirará en 4 horas.</p>
                        `
                    await sendMail({
                subject,
                html
            })
        
            res.status(200).send({status: 'success', message: 'Mail enviado, revise su bandeja de entrada o spam'})
        } catch (error) {
            logger.info(error)
        }
    }

    resetPasswordToken = async (req, res)=>{
        try {
            const {token} = req.params
            res.render('resetPass', {token, showNav: false})
        } catch (error) {
            logger.info(error)
        }
    }

    resetPassword = async (req, res)=>{
        try {
            
            const { passwordNew, passwordConfirm, token } = req.body
          
            // Validación de contraseñas, si son iguales o están vacias
            if (!passwordNew || !passwordConfirm || passwordNew !== passwordConfirm) return res.status(400).send({
                status: 'error', 
                message: 'Las contraseñas no pueden estar vacías y deben coincidir'
            })
            if (passwordNew !== passwordConfirm) return res.status(400).send({status: 'error', message: 'Las contraseñas no coinciden'})
        
            const decodedUser = jwt.verify(token, jwt_private_key)
            
            
            if (!decodedUser) return res.status(400).send({status: 'error', message: 'El token no es válido o ha expirado'})
        
            // Buscar usuario en DB
            const {_doc: userDB} = await userModel.findOne( {email: decodedUser.email})
            
            if (!userDB) return res.status(400).send({status: 'error', message: 'El usuario no existe'})
                    let isValidPass = isValidPassword(userDB, passwordNew)
            
            if (isValidPass) return res.status(400).send({status: 'error', message: 'No puedes usar una contraseña anterior.'})
           
            const result = await userModel.findByIdAndUpdate({_id: userDB._id}, {
                password: createHash(passwordNew)
            })
           
            if (!result) return res.status(400).send({status: 'error', message: 'Error al actualizar la contraseña'})
        
            res.status(200).send({
                status: 'success', 
                message: 'Contraseña actualizada correctamente'
            })
        } catch (error) {
            logger.info(error)
        }
    }

}

module.exports = new AuthController()