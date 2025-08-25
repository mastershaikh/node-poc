const express = require('express');
const User = require('../models/user');
const userRouter = express.Router();

const userAuth = require('../middlewares/auth');
const connection = require('../models/connection');

userRouter.get('/users/feed', userAuth, async (req, res) => {
    const user = req.user;
    const connections = await connection.find(
            { requesterId: user._id}, {status: 'accepted'}
    ).populate('recipientId', ['firstName', 'lastName', 'skills', 'shortBio']);
    res.status(200).json(connections);
});

module.exports = userRouter;