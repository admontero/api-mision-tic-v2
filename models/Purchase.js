const mongoose = require('mongoose');

const PurchaseSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['en proceso', 'cancelada', 'entregada']
    },
    client_id: {
        type: Number,
        required: true,
    },
    client_name: {
        type: String,
        required: true,
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.String,
                ref: 'Product'
            },
            product_quantity: {
                type: Number,
                required: true
            },
            product_price: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Purchase', PurchaseSchema);