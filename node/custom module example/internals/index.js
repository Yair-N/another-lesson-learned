// const response = require('./response.js')
// const request = require('./request.js')

module.exports = {
    ...require('./response.js'),
    ...require('./request.js'),
}

// module.exports = {
//     read: response.read,
//     send: request.send,
//     REQUEST_TIMEOUT: request.TIMEOUT,
// }