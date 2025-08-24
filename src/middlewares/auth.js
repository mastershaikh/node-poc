const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies || !cookies.token) {
        return res.status(401).send('Unauthorized: No token provided');
    }
    const token = cookies.token;
    const decodedMessage = await jwt.verify(token, 'mysecretkey');
    const {id} = decodedMessage;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    req.user = user;
    next();

}

module.exports = userAuth;