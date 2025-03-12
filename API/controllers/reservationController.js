const Reservation = require('../models/reservationModel');
const Car = require('../models/carModel');
const Account_User = require('../models/userModel');

exports.make_reservation = async (req, res) => {
    const { carId, userId, start_date, end_date, total_amount, payment_status } = req.body;

    try {
        if (!carId || !userId || !start_date || !end_date || !total_amount || !payment_status) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Voiture non trouvée.' });
        }

        const user = await Account_User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const newReservation = new Reservation({
            car_id: carId,
            user_id: userId,
            start_date,
            end_date,
            status: 'pending',
            total_amount,
            payment_status
        });

        await newReservation.save();

        res.status(201).json({ message: 'Réservation effectuée avec succès.', reservation: newReservation });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};

exports.edit_reservation = async (req, res) => {
    const { reservationId } = req.params;
    const { carId, userId, start_date, end_date, total_amount, payment_status } = req.body;

    try {
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée.' });
        }

        if (carId) {
            const car = await Car.findById(carId);
            if (!car) {
                return res.status(404).json({ message: 'Voiture non trouvée.' });
            }
            reservation.car_id = carId;
        }

        if (userId) {
            const user = await Account_User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }
            reservation.user_id = userId;
        }

        if (start_date) reservation.start_date = start_date;
        if (end_date) reservation.end_date = end_date;
        if (total_amount) reservation.total_amount = total_amount;
        if (payment_status) reservation.payment_status = payment_status;

        await reservation.save();

        res.status(200).json({ message: 'Réservation mise à jour avec succès.', reservation });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};


exports.delete_reservation = async (req, res) => {
    const { reservationId } = req.params;

    try {
        const reservation = await Reservation.findByIdAndDelete(reservationId);

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée.' });
        }

        res.status(200).json({ message: 'Réservation supprimée avec succès.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};
