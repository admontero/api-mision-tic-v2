const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['disponible', 'no disponible']
    }
});

module.exports = mongoose.model('Product', ProductSchema);