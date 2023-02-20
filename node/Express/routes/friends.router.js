const express = require('express')

const friendsRouter = express.Router();
const friendsController = require('../controllers/friends.controller.js')

friendsRouter.use((req, res, next) => {
    console.log(`ip address: ${req.ip}`)
    next()
})
friendsRouter.post('/', friendsController.postFriend)

friendsRouter.get('/', friendsController.getFriendsList)

friendsRouter.get('/:friendId', friendsController.getFriend)

module.exports = friendsRouter
