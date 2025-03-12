const mongoose = require('mongoose');

const penaltySchema = new mongoose.Schema({
    reservation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',  // Référence au modèle Reservation
        required: true
    },
    penalty_amount: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    penalty_date: {
        type: Date,
        required: true
    },
    payment_status: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'unpaid'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Penalty', penaltySchema);