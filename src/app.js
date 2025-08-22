const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');

const app = express();

connectDb().then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection error:', err);
});

app.post('/signup', async (req, res) => {
    const userData = req.body;
    
    const userObj = {
        firstName: "Nizamuddin",
        lastName: "Shaikh",
        email: "abc@gmail.com",
        password:"asdasdf",
        age:"32"
    }

    const user = new User(userObj);
    await user.save().then(() => {
        res.status(201).send('User created');
    }).catch(err => {
        res.status(400).send('Error creating user: ' + err.message);
    });
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});