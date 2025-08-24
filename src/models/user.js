const mongoose = require('mongoose');
const validator = require('validator');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minLength: 3, maxLength: 30},
    lastName: {type: String, required: true, minLength: 3, maxLength: 30},
    email: { 
        type: String, 
        unique: true, 
        lowercase: true, 
        required: true,
        validate(value) {
            validator.isEmail(value);
        },
        trim: true },
    password: {type: String, required: true},
    age: {
        type: Number,
        validate(value) {
            value >= 13 && value <= 120
        },
        required: true
    },
    gender: {type: String, enum: ['M', 'F', 'O'], default: 'O'},
    photoUrl: {type: String, default: ''},
    shortBio: {type: String, default: ''},
    skills: {type: [String], default: []},
    createdAt: { type: Date, default: Date.now }
});

userSchema.methods.getJwt = async function() {
    const user = this;
    const token = await jwt.sign({ id: user._id, email: user.email }, 'mysecretkey', { expiresIn: '1d' });
    return token;
}

userSchema.methods.verifyPassword = async function(passwordInputByUser) {
    const user = this;

    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);