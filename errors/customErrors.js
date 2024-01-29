
class CustomError extends Error {
    constructor(msg, stateCode) {
        super(msg)
        this.stateCode = stateCode
    }
}

module.exports = CustomError