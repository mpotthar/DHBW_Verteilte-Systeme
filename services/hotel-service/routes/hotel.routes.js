const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');

// GET /api/hotels - Alle Hotels abrufen
router.get('/', hotelController.getAllHotels);

// GET /api/hotels/:id - Ein Hotel abrufen
router.get('/:id', hotelController.getHotelById);

// POST /api/hotels - Neues Hotel erstellen
router.post('/', hotelController.createHotel);

// PUT /api/hotels/:id - Hotel aktualisieren
router.put('/:id', hotelController.updateHotel);

// DELETE /api/hotels/:id - Hotel löschen
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;
