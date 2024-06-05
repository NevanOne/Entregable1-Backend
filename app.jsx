// App.js
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51POBg72M2iNkhaoXCUdaCLHTkjmWXksgkSjF2gLz4Puj2aoHcU1g4PuuzYe9f51Ae52o70n6UAzuBVTQ6iw7sJ4U00DRfZjWWn');

const App = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

// CheckoutForm.js
import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (!error) {
            const { id } = paymentMethod;

            // Llama a tu servidor para crear una sesión de pago
            const response = await fetch('/payment/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const session = await response.json();

            // Redirige a la página de pago de Stripe
            stripe.redirectToCheckout({ sessionId: session.id });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pagar
            </button>
        </form>
    );
};

export { CheckoutForm, App }