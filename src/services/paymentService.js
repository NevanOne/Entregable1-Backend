const AxiosClient = require('./axiosClient');
const { getHeaders } = require('../utils/http');
require('dotenv').config

const { REACT_APP_BASE_URL, REACT_APP_PAYMENT_ENDPOINT } = process.env;

class PaymentService {
    constructor() {
        this.client = new AxiosClient();
    }

    createPaymentIntent = ({ productId, callbackSuccess, callbackError }) => {
        const requestInfo = { url: `${REACT_APP_BASE_URL}${REACT_APP_PAYMENT_ENDPOINT}/payment-intents?id=${productId}`, callbackSuccess, callbackError };
        this.client.makePostRequest(requestInfo);
    }

    pay = ({ body, callbackSuccess, callbackError }) => {
        const requestInfo = { url: `${REACT_APP_BASE_URL}${REACT_APP_PAYMENT_ENDPOINT}/checkout`, body, config: getHeaders(), callbackSuccess, callbackError }
        this.client.makePostRequest(requestInfo);
    }
}

module.exports = PaymentService;