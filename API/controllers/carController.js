const Car = require('../models/carModel');
const fs = require('fs');
const path = require('path');

exports.save_car = async (req, res) => {
    const { mark, model, year, IM, type, tariff, fuelType, transmission, seats, description } = req.body;
    const imageTempPath = req.file ? req.file.path : '';

    try {
        if (!mark || !model || !year || !IM || !type || !tariff || !imageTempPath) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
        }

        const newCar = new Car({
            mark,
            model,
            year,
            IM,
            type,
            tariff,
            image: '',
            fuelType: fuelType || 'essence',
            transmission: transmission || 'manuelle',
            seats: seats || 4,
            description: description || 'Aucune description disponible'
        });

        const savedCar = await newCar.save();

        const newImageName = `${savedCar._id}${path.extname(imageTempPath)}`;
        const newImagePath = path.join('uploads/cars', newImageName);

        fs.rename(imageTempPath, newImagePath, (err) => {
            if (err) {
                console.error('Erreur lors du renommage de l\'image:', err);
                return res.status(500).json({ message: 'Erreur serveur lors du renommage de l\'image.' });
            }

            savedCar.image = newImagePath.replace('uploads/', '');
            savedCar.save();

            res.status(201).json({ message: 'La voiture a été ajoutée avec succès.', car: savedCar });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};


exports.edit_car = async (req, res) => {
    const { carId } = req.params;
    const { mark, model, year, IM, type, tariff, fuelType, transmission, seats, description } = req.body;
    let image = req.file ? req.file.path : '';

    try {
        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ message: 'Voiture non trouvée.' });
        }

        car.mark = mark || car.mark;
        car.model = model || car.model;
        car.year = year || car.year;
        car.IM = IM || car.IM;
        car.type = type || car.type;
        car.tariff = tariff || car.tariff;
        car.fuelType = fuelType || car.fuelType;
        car.transmission = transmission || car.transmission;
        car.seats = seats || car.seats;
        car.description = description || car.description;

        
        if (image) {
            const newImageName = `${car._id}${path.extname(image)}`;
            const newImagePath = path.join('uploads/cars', newImageName);

            fs.rename(image, newImagePath, (err) => {
                if (err) {
                    console.error('Erreur lors du renommage de l\'image:', err);
                    return res.status(500).json({ message: 'Erreur serveur lors du renommage de l\'image.' });
                }

                car.image = newImagePath.replace('uploads/', '');

                car.save()
                    .then(() => {
                        res.status(200).json({ message: 'Voiture mise à jour avec succès.', car });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
                    });
            });
        } else {
            await car.save();
            res.status(200).json({ message: 'Voiture mise à jour avec succès.', car });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};


exports.delete_car = async (req, res) => {
    const { carId } = req.params;

    try {
        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ message: 'Voiture non trouvée.' });
        }

        if (car.image) {
            const imagePath = path.join('uploads/cars', car.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression de l\'image:', err);
                }
            });
        }

        await Car.findByIdAndDelete(carId);

        res.status(200).json({ message: 'Voiture supprimée avec succès.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
};
