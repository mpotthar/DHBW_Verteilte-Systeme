const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');

// GET /api/flights - Alle Flüge abrufen
router.get('/', flightController.getAllFlights);

// GET /api/flights/:id - Einzelnen Flug abrufen
router.get('/:id', flightController.getFlightById);

// POST /api/flights - Neuen Flug anlegen
router.post('/', flightController.createFlight);

// PUT /api/flights/:id - Flug aktualisieren
router.put('/:id', flightController.updateFlight);

// DELETE /api/flights/:id - Flug löschen
router.delete('/:id', flightController.deleteFlight);

module.exports = router;
