const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const { validateSignUpData } = require('./utils/validation');

const cookieParser = require('cookie-parser');

const userAuth = require('./middlewares/auth');

const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDb().then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection error:', err);
});

app.post('/signup', async (req, res) => {
     const userData = await req.body;
    const { isValid, errors } = validateSignUpData(userData);
    if (!isValid) {
        return res.status(400).json({ errors });
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    const userObj = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: passwordHash,
        age: userData.age
    }

    const user = new User(userObj);
    await user.save().then(() => {
        res.status(201).send('User created');
    }).catch(err => {
        res.status(400).send('Error creating user: ' + err.message);
    });
});

app.get('/user', userAuth, async (req, res) => {
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

app.get('/feed', userAuth, async (req, res) => {
    const user = await User.find();
    res.status(200).json(user);
});

app.delete('/user',userAuth, async (req, res) => {
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

app.patch('/user', userAuth, async (req, res) => {
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


app.post('/login', async (req, res) => {
    const { email, password } = await req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }
    const user = await User
        .findOne({ email });
    if (!user) {    
        return res.status(404).send('Invalid credentials');
    }   
    const isPasswordMatch = await user.verifyPassword(password);
    if (!isPasswordMatch) {
        return res.status(400).send('Invalid credentials');
    }
    const token = await user.getJwt();
    res.cookie('token', token);
    return res.status(200).send('Login successful');
});

app.get('/profile', userAuth, async (req, res) => {
    
    return res.status(200).send(req.user);
});

app.post('/connection-request', userAuth, async (req, res) => {
    const user = req.user;
    return res.status(200).send(user.firstName + ' Sent Connection request sent');
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});