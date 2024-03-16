const {Router} = require('express')
const {fork} = require('child_process')
const { sendMail } = require('../utils/sendemail.js')

const router = Router()

router.get('/mail'), (req,res) =>{
    const destinatario = 'destinatario'
    const subject = 'Email Prueba'
    const html = '<div><h1>Email de prueba</h1></div>'
    sendMail(destinatario,subject,html)
    res.send('email enviado')
}