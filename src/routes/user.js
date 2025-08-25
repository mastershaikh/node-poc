const express = require('express');
const User = require('../models/user');
const userRouter = express.Router();

const userAuth = require('../middlewares/auth');
const connection = require('../models/connection');

userRouter.get('/users/requests/received', userAuth, async (req, res) => {
    const user = req.user;
    const connections = await connection.find(
            { recipientId: user._id, status: 'pending' }
    ).populate('requesterId', ['firstName', 'lastName', 'skills', 'shortBio']);
    res.status(200).json(connections);
});

userRouter.get('/users/connections', userAuth, async (req, res) => {
    const user = req.user;
    const connections = await connection.find(
            { $or: [ { requesterId: user._id}, { recipientId: user._id} ], status: 'accepted' }
    ).populate('requesterId recipientId', ['firstName', 'lastName', 'skills', 'shortBio']);
    res.status(200).json(connections);
});

userRouter.get('/users/feed', userAuth, async (req, res) => {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const connections = await connection.find(
            { $or: [ { requesterId: user._id}, { recipientId: user._id} ], status: 'accepted' }
    );

    const connectedUserIds = connections.map(conn => 
        (conn.requesterId.toString() === user._id.toString()) ? conn.recipientId : conn.requesterId
    );

    const feedUsers = await User.find({ 
        _id: { $nin: [...connectedUserIds, user._id] } 
    }).select('firstName lastName skills shortBio').skip((page - 1) * limit).limit(limit);

    res.status(200).json(feedUsers);
});

module.exports = userRouter;