const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middlewares/auth');


requestRouter.post('/connection-request', userAuth, async (req, res) => {
    const user = req.user;
    return res.status(200).send(user.firstName + ' Sent Connection request sent');
});

module.exports = requestRouter;