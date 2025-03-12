const mongoose = require('mongoose');

const payoffSchema = new mongoose.Schema({
    reservation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',  // Référence au modèle Reservation
        required: true
    },
    payment_date: {
        type: Date,
        required: true
    },
    payment_method: {
        type: String,
        required: true,
        enum: ['credit_card', 'bank_transfer', 'paypal', 'cash'],
        default: 'credit_card'
    },
    amount_paid: {
        type: Number,
        required: true
    },
    payment_status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Payoff', payoffSchema); 