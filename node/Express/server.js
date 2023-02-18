const express = require("express");

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`)
})


const friends = [{
    id: 0,
    name: 'Albert Einstein'
}, {
    id: 1,
    name: 'Sir Isaac Newton'
}];

app.get('/friends', (req, res) => {
    res.json(friends)
})

app.get('/friends/:friendId', (req, res) => {
    const friendId = Number(req.params.friendId);
    const friend = friends[friendId];
    if (friend) {
        res.json(friend)
    } else {
        res.status(404).json({
            error: 'Friend does not exist'
        })
    }
})