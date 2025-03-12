const express = require('express');
const router = express.Router();

const controller = require('../controllers/carController');
const upload = require('../middlewares/multer');

router.post('/save_car', upload.single('image'), controller.save_car);

router.post('/edit_car/:id', upload.single('image'), controller.edit_car);

router.delete('/delete_car/:id', controller.delete_car);

module.exports = router;
