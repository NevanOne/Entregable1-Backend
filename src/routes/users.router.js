import { Router } from "express";
import { userModel } from "../db/models/user.model";

const router = Router();

router.get('/', async (req,res)=>{
    try {
        let users = await userModel.find()
        res.send({result:"success",payload:users})
    } catch (error) {
        console.log("No se puede obtener usuarios con mongoose:"+error)
    }
})

router.get('/', async (req, res)=>{  
    try {
        const users = await userModel.find({})

        res.send(users)
    } catch (error) {
        console.log(error)
    }

}) 


router.get('/:uid', async (req, res)=>{
    const { uid } = req.params
    const user = await userModel.findOne({_id: uid})
    res.send(user)
}) 

// Crear usuario 
router.post('/', async (req, res)=>{
    const {first_name, last_name, email, password } = req.body
   
    const userNew = {
        first_name,
        last_name,
        email,
        password
    }

    const result = await userModel.create(userNew)

    res.status(200).send({
        status: 'success',
        usersCreate: result
    })
}) 


router.put('/:uid', async (req, res)=>{
    const {uid} = req.params
    const userToUpdate = req.body

    const result = await userModel.findOneAndUpdate({_id: uid}, userToUpdate, {new: true})

    res.status(200).send({
        status: 'success',
        message: result
    })
}) 

// DELETE 

router.delete('/:uid', async (req, res)=>{
    const {uid} = req.params
    const result = await userModel.findByIdAndDelete({_id: uid})
    res.send(result)
})

module.exports = router

