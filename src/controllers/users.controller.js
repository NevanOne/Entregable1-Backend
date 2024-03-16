const { userService } = require('../services')
const CustomError = require('../utils/errors/CustomeError')
const EErrors = require('../utils/errors/enums')
const { generateUserErrorInfo } = require('../utils/errors/info')

class UserController {

    getUsers = async (req, res) =>{    
        try {  
            const { limit=5, page=1 }= req.query            
            const result = await userService.getUsers(parseInt(limit), parseInt(page))   
            res.status(200).send({
                status: 'success',
                payload: result
            })
        } catch (error) {
            console.log(error) 
        }
    }

    getUser = async (request, response) => {
        try {
            const {uid} = request.params
            const result = await userService.getUser(uid)
            response.status(200).send({
                status: 'success',
                payload: result
            })            
        } catch (error) {
            console.log(error)
        }
    }

    createUser = async (req, res = response, next) =>{
        try {
            let {nombre, apellido, email } = req.body
            if (!nombre || !apellido || !email) {
                CustomError.createError({
                    name: 'User creation error',
                    cause: generateUserErrorInfo({
                        first_name: nombre, 
                        last_name: apellido, 
                        email
                    }),
                    message: 'Error Trying to create user',
                    code: EErrors.INVALID_TYPES_ERROR
                })
                
            }
        
            res.status(201).send({ 
                status: 'success',
                payload: 'result'
            })
            
        } catch (error) {
            next(error)            
        }
            
        
    }
    
    upgradeToPremiun = async (req, res) => {
        try {
            
            const { uid } = req.params
            const user = await userService.getUser(uid)
            if (!user.documents || user.documents.length < 3) {
              return res.status(400).json({ 
                status: 'error',
                error: `El usuario no ha terminado de procesar su documentación. Falta ${3 - user.documents.length} documento.` })
            }
            user.isPremium = true
            await user.save()

            res.status(200).send({
                status: 'success',
                payload: user,
                documentsLength: user.documents.length
            })
        } catch (error) {
            console.log(error)
        }       
    }

    uploadDocuments = async (req, res) => {
        try {
            const { uid } = req.params
            const files = req.files
            console.log(files.length)
            if (!files) {
                return res.status(400).json({ 
                    status: 'error',
                    error: 'Faltan datos o archivos requeridos.' })
            }
        
            const user = await userService.getUser(uid)
            if (!user) {
              return res.status(404).json({ error: 'Usuario no encontrado.' })
            }
            console.log(user)
        
            user.documents = user.documents || []
        
            files.forEach((file) => {
              user.documents.push({
                name: file.filename,
                reference: file.destination, 
              })
            })
        
            let  result = await user.save()
        
            res.status(400).json({ 
                status: 'success', 
                payload: result
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' })
        }
    }

    updateUser = async (request, response) =>{

        const { uid } = request.params
        let { nombre, apellido, email }  = request.body
    
        if (!nombre || !apellido || !email) {
            return response.status(400).send({ message: 'Che pasar todos los datos'})
        }
            let result = await UserModel.updateOne({_id: uid}, { nombre })
    
        response.status(201).send({ 
            status: 'success',
            result : result //-> result
        })
    }

    deleteUser = async (req, res)=> {
        const { uid } = req.params
        await UserModel.deleteOne({_id: uid})
        
        res.status(200).send({ 
            status: 'success',
            result: true
         })
    }

}

module.exports = new UserController()