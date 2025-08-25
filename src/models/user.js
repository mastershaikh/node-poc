const mongoose = require('mongoose');
const validator = require('validator');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minLength: 3, maxLength: 30, index: true},
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

userSchema.methods.comparePassword = async function(oldPassword) {
    const user = this;
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    return isMatch;
}

userSchema.methods.savePassword = async function(newPassword) {
    const user = this;
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save().then(() => {
        return true;
    }).catch(err => {
        throw new Error('Error updating password: ' + err.message);
    });
}

module.exports = mongoose.model('User', userSchema);