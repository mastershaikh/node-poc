const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middlewares/auth');

const Connection = require('../models/connection');


requestRouter.post('/connection/request/:status/:recipientId', userAuth, async (req, res) => {
    const recipientId = req.params.recipientId;
    if (!recipientId) {
        return res.status(400).send('Recipient id is required');
    }

    const user = req.user;

    const requesterId = req.user._id;
    let status = req.params.status;

    if (!['interested', 'ignored'].includes(status)) {
        return res.status(400).send('Invalid status');
    }

    const connectionRequest = {
        requesterId: requesterId,
        recipientId: recipientId,
        status: status
    };

    const connection = new Connection(connectionRequest);
    await connection.save().catch(err => {
        return res.status(400).send('Error creating connection request: ' + err.message);
    });

    return res.status(200).send(user.firstName + ' sent connection request to user with id ' + recipientId);
});

requestRouter.post('/connection/respond/:status/:requesterId', userAuth, async (req, res) => {
    const requesterId = req.params.requesterId;
    if (!requesterId) {
        return res.status(400).send('Requester id is required');
    }

    const user = req.user;

    const recipientId = req.user._id;
    const status = req.params.status;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).send('Invalid status');
    }

    const connection = await Connection.findOne({ requesterId: requesterId, recipientId: recipientId }).catch(err => {
        return res.status(400).send('Error finding connection request: ' + err.message);
    });

    if (!connection) {
        return res.status(404).send('Connection request not found');
    }

    connection.status = status;
    connection.updatedAt = Date.now();

    await connection.save().catch(err => {
        return res.status(400).send('Error updating connection request: ' + err.message);
    });

    return res.status(200).send(user.firstName + ' ' + status + ' connection request from user with id ' + requesterId);
});

module.exports = requestRouter;