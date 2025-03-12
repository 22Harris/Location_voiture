const express = require('express');
const router = express.Router();

const controller = require('../controllers/reservationController');

router.post('/make_reservation/', controller.make_reservation);
router.post('/edit_reservation/:id', controller.edit_reservation);
router.delete('/delete_reservation/:id', controller.delete_reservation)

module.exports = router;