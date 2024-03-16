class CustomError {
    static createError({name='Error', cause, message, code=1}) {
        let error = new Error(message)
        error.cause = cause  
        error.name = name
        error.code = code
        throw error
    }
}

module.exports = CustomError 