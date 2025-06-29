const Car = require('../models/car');

// Alle Mietwagen abrufen
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Mietwagen', error: error.message });
  }
};

// Einen einzelnen Mietwagen abrufen
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Mietwagen nicht gefunden' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Mietwagens', error: error.message });
  }
};

// Neuen Mietwagen anlegen
exports.createCar = async (req, res) => {
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen des Mietwagens', error: error.message });
  }
};

// Mietwagen aktualisieren
exports.updateCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ message: 'Mietwagen nicht gefunden' });
    }
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Aktualisieren des Mietwagens', error: error.message });
  }
};

// Mietwagen löschen
exports.deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Mietwagen nicht gefunden' });
    }
    res.status(200).json({ message: 'Mietwagen erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Mietwagens', error: error.message });
  }
};
