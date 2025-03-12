const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    mark: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    IM: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    fuelType: {
        type: String,
        required: true,
        enum: ['essence', 'diesel', 'électrique', 'hybride'] // Liste des types de carburants
    },
    transmission: {
        type: String,
        required: true,
        enum: ['manuelle', 'automatique'] // Types de transmission
    },
    seats: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'available',
        enum: ['available', 'rented', 'maintenance'] // Enum pour les statuts
    },
    tariff: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);
