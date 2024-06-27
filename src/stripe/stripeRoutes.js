const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

const stripe = Stripe('sk_test_51POBg72M2iNkhaoXbHQqiRHyILERwCjMZ0VUOypoOWtnuO5WqvZHxAlLnQgnHtbu6hpw3vhDPIx1YpGZQHCfzmua00XG4Wfnjo');

router.post('/create-checkout-session', async (req, res) => {
    const { id } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Product Name',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:8080/success',
            cancel_url: 'http://localhost:8080/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).send(`Error creating checkout session: ${error.message}`);
    }
});

module.exports = router;
