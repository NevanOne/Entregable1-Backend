const { connect, set } = require('mongoose')
const { logger } = require('../middleware/logger')


class MongoSingleton {
    static #instance

    constructor(){
        set('strictQuery', false)
        connect('mongodb+srv://Gabriel1998:Gabriel1998@coderhouse.lpjfxh1.mongodb.net/',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .catch(err => logger.error(err))
    }

    static getInstance(){
        if (this.#instance) {
            logger.info('Ya está conectada a la base de Datos')
            return this.#instance
        }

        this.#instance = new MongoSingleton()
        logger.info('conected')
        return this.#instance
    }
}

module.exports = MongoSingleton
