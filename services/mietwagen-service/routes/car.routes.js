const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');

// GET /api/cars - Alle Mietwagen abrufen
router.get('/', carController.getAllCars);

// GET /api/cars/:id - Einen Mietwagen abrufen
router.get('/:id', carController.getCarById);

// POST /api/cars - Neuen Mietwagen erstellen
router.post('/', carController.createCar);

// PUT /api/cars/:id - Mietwagen aktualisieren
router.put('/:id', carController.updateCar);

// DELETE /api/cars/:id - Mietwagen löschen
router.delete('/:id', carController.deleteCar);

module.exports = router;
