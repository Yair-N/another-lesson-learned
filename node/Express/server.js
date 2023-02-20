const express = require("express");
const path = require('path')
const friendsRouter = require('./routes/friends.router')
const messageRouter = require('./routes/messages.router')

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const PORT = 3000;




//middleware
app.use((req, res, next) => {
    const start = Date.now()
    next();
    const delta = Date.now() - start
    console.log(`${req.method} ${req.baseUrl} ${req.url} ${delta}ms`);

})
const publicPath = path.join(__dirname, 'public')
//middleware
app.use('/site', express.static(publicPath))
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index', {
        title: 'My Friends Are VERYY Clever',
        caption: 'Let\'s go skiing!',
    });
});

app.use('/friends', friendsRouter);
app.use('/messages', messageRouter);


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`)
})
