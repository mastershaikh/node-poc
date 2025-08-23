const validator = require('validator');

const validateSignUpData = (data) => {
    const errors = [];
    if (!data.firstName || typeof data.firstName !== 'string') {
        errors.push('First name is required and must be a string.');
    }
    if (!data.lastName || typeof data.lastName !== 'string') {
        errors.push('Last name is required and must be a string.');
    }
    if (!validator.isEmail(data.email)) {
        errors.push('A valid email is required.');
    }
    if (!validator.isStrongPassword(data.password || '', { minLength: 6 })) {
        errors.push('Password is required and must be at least 6 characters long.');
    }
    if (data.age && (typeof data.age !== 'number' || data.age < 0)) {
        errors.push('Age must be a positive number if provided.');
    }
    return { isValid: errors.length === 0, errors };
};

module.exports = { validateSignUpData };