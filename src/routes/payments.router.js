const {Router} = require('express')
const { PaymentService } = require('../services/payments')
const router = Router()

const products = [
    { id: 1, name: "papas", price: 1000 },
    { id: 2, name: "queso", price: 500 },
    { id: 3, name: "hamburguesa", price: 1500 },
    { id: 4, name: "soda", price: 1000 },
    { id: 5, name: "golosinas", price: 800 }
]

router.post('/payment-intents', async(req,res) => {
    res.send('intento de pago')
    const { id } = req.query
    const productRequested = products.find(product=> product.id === parseInt(id))
    if (!productRequested) return res.status(404).send({status: "error", error: "Producto no encontrado"});
    const paymentIntentInfo = {
        amount: productRequested.price,
        currency: 'usd'
    }
    const service = new PaymentService();
    let result = await service.createPaymentIntent(paymentIntentInfo);
    console.log(result);
    res.send({status:"success", payload:result})
})

module.exports = router;
