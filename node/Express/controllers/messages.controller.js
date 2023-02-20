const path = require('path');

function getMessages(req, res) {
    // res.send(`<ul><li> Helloo Albert!</li></ul>`)
    const file = path.join(__dirname, '..', 'public', 'skimountain.jpg')
    res.sendFile(file)
}

function postMessages(req, res) {
    console.log(`Updating messages...`)
}

module.exports = {
    getMessages,
    postMessages,
}