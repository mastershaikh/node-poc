const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/auth');

profileRouter.get('/profile', userAuth, async (req, res) => {
    const emailId = req.query.email;
    if (emailId) {
        const user = await User.findOne({ email: emailId });
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    }
});

profileRouter.get('/feed', userAuth, async (req, res) => {
    const user = await User.find();
    res.status(200).json(user);
});

profileRouter.delete('/profile',userAuth, async (req, res) => {
    const emailId = req.query.email; 
    if (emailId) {
        await User.deleteOne({ email: emailId }).then((result) => {
            if (result.deletedCount > 0) {
                return res.status(200).send('User deleted successfully');
            }   else {  
                return res.status(404).send('User not found');
            }
        }).catch(err => {
            return res.status(400).send('Error deleting user: ' + err.message);
        });
    }
});

profileRouter.patch('/profile', userAuth, async (req, res) => {
    const updateData = await req.body;

    const ALLOWED_UPDATES = ['firstName', 'lastName', 'skills', 'shortBio', 'age', 'gender'];

    const isValidOperation = Object.keys(updateData).every((update) => ALLOWED_UPDATES.includes(update));

    if (isValidOperation) {
        await User.updateOne({_id: req.user._id}, { $set: updateData }).then((result) => {
            if (result.matchedCount > 0) {
                return res.status(200).send('User updated successfully');
            } else {
                return res.status(404).send('User not found');
            }
        }).catch(err => {
            return res.status(400).send('Error updating user: ' + err.message);
        });
    } else {
        return res.status(400).send('Invalid updates! Allowed updates are: ' + ALLOWED_UPDATES);
    }
});

module.exports = profileRouter;