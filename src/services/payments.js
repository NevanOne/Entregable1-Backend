const stripe = require('stripe')

class PaymentService{
    constructor(){
        this.stripe = new Stripe(process.env.sk_test_51POBg72M2iNkhaoXbHQqiRHyILERwCjMZ0VUOypoOWtnuO5WqvZHxAlLnQgnHtbu6hpw3vhDPIx1YpGZQHCfzmua00XG4Wfnjo)
    }
    createPaymentIntent = async (data) => {
        return await this.stripe.paymentIntent.create(data)
    }
}

module.exports = {
    PaymentService
}