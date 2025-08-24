const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { validateSignUpData } = require('../utils/validation');

authRouter.post('/signup', async (req, res) => {
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
        age: userData.age,
        gender: userData.gender,
        photoUrl: userData.photoUrl,
        shortBio: userData.shortBio,
        skills: userData.skills
    }

    const user = new User(userObj);
    await user.save().then(() => {
        res.status(201).send('User created');
    }).catch(err => {
        res.status(400).send('Error creating user: ' + err.message);
    });
});

authRouter.post('/login', async (req, res) => {
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

authRouter.post('/logout', async (req, res) => {
    res.clearCookie('token');
    return res.status(200).send('Logout successful');
});

module.exports = authRouter;