const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'interested', 'ignored'], 
        message: 'Status can be either pending, accepted or rejected',
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

connectionSchema.pre('save', function(next) {
    const connection = this;
    if (connection.requesterId === connection.recipientId) {
        throw new Error('Requester and recipient cannot be the same user');
    }
    next();
});

connectionSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);