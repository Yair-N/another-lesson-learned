const express = require('express')
// const cluster = require('cluster') working with pm2
const os = require('os')
const app = express()

// a bad way to delay
function delay(duration) {
    const startTime = Date.now()
    while (Date.now() - startTime < duration) {
        //event loop is blocked..
    }
}

app.get('/', (req, res) => {
    res.send(`Performance example ${process.pid}`)
})


app.get('/timer', (req, res) => {
    delay(9000);
    res.send(`Ding Ding Ding ${process.pid}`)
})

// if (cluster.isMaster) {
//     console.log('Master has been started...')
//     // getting amount of logical cors
//     const NUM_WORKERS = os.cpus().length
//     for (let i = 0; i < NUM_WORKERS; i++ ){
//         cluster.fork()
//     }


// } else {

console.log('Running server.js...')
console.log('Worker process started.')
app.listen(3000)
    // console.log('Listening on PORT 3000.')
// }

