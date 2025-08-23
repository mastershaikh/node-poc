const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(express.json());

connectDb().then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection error:', err);
});

app.post('/signup', async (req, res) => {
     const userData = await req.body;
    
    const userObj = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        age: userData.age
    }

    const user = new User(userObj);
    await user.save().then(() => {
        res.status(201).send('User created');
    }).catch(err => {
        res.status(400).send('Error creating user: ' + err.message);
    });
});

app.get('/user', async (req, res) => {
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

app.get('/feed', async (req, res) => {
    const user = await User.find();
    res.status(200).json(user);
});

app.delete('/user', async (req, res) => {
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

app.patch('/user', async (req, res) => {
    const emailId = req.body.email; 
    const updateData = await req.body;

    const ALLOWED_UPDATES = ['firstName', 'lastName', 'password', 'age']

    const isValidOperation = Object.keys(updateData).every((update) => ALLOWED_UPDATES.includes(update));

    if (emailId) {
        await User.updateOne({ email: emailId }, { $set: updateData }).then((result) => {
            if (result.matchedCount > 0) {
                return res.status(200).send('User updated successfully');
            } else {
                return res.status(404).send('User not found');
            }
        }).catch(err => {
            return res.status(400).send('Error updating user: ' + err.message);
        });
    }
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});