const express = require('express');
const router = express.Router();
const stripe = require('../stripe/stripe');
const { PaymentService } = require('../services/payments')

const products = [
    { id: 1, name: "papas", price: 1000 },
    { id: 2, name: "queso", price: 500 },
    { id: 3, name: "hamburguesa", price: 1500 },
    { id: 4, name: "soda", price: 1000 },
    { id: 5, name: "golosinas", price: 800 }
]

router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Nombre del Producto',
                    },
                    unit_amount: 2000, // Monto
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel`,
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/payment-intents', async (req,res) =>{
    const { id } = req.query
    const productRequested = products.find(product => product.id === parseInt(id))
    if(!productRequested) return res.status(404).send({status: "error", error: 'Producto no encontrado'})
        const paymentIntentInfo = {
         amount: productRequested.price,
         currency: 'USD'
        }
       const service = new PaymentService()
       let result = await service.createPaymentIntent(paymentIntentInfo) 
    res.send({status: 'success', payload: result})
})

module.exports = router;
