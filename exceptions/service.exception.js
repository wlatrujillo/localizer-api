function ServiceException(message, code) {
    this.message = message;
    this.code = code;
}

module.exports = ServiceException;
