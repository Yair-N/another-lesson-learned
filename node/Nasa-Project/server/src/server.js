const http = require('http')
const mongoose = require('mongoose')

const { loadPlanetsData } = require('./models/planets.model')
const app = require('./app')

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://yair:mongo2022@cluster0.yguij.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app)

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

mongoose.set('strictQuery', false)

async function startServer() {
    await mongoose.connect(MONGO_URL)
        // deprecated options
        // ,{
        //     useNewUrlParser: true,
        //     useFindAndModify: false,
        //     useCreateIndex: true,
        //     useUnifiedTopology: true,
        // })
    
    await loadPlanetsData()
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}

startServer()