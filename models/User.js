const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'pendiente',
        enum: ['pendiente', 'autorizado', 'no autorizado']
    }
});

module.exports = mongoose.model('User', UserSchema);