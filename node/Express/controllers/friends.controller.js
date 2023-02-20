const model = require('../models/friends.model')


function postFriend(req, res) {

    if (!req.body.name) {
        return res.status(400).json({
            error: 'no name was assigned'
        })
    }
    const newFriend = {
        name: req.body.name,
        id: model.length
    }

    model.push(newFriend)

    res.json(newFriend)
}


function getFriendsList(req, res) {
    res.json(model)
}

function getFriend(req, res) {
    const friendId = Number(req.params.friendId);
    const friend = model[friendId];
    if (friend) {
        res.json(friend)
    } else {
        res.status(404).json({
            error: 'Friend does not exist'
        })
    }
}
module.exports = {
    getFriendsList,
    getFriend,
    postFriend,
}

