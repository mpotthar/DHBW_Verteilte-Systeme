const Flight = require('../models/flight');

// Alle Flüge abrufen
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Flüge', error: error.message });
  }
};

// Einen einzelnen Flug abrufen
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flug nicht gefunden' });
    }
    res.status(200).json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Flugs', error: error.message });
  }
};

// Neuen Flug anlegen
exports.createFlight = async (req, res) => {
  try {
    const newFlight = new Flight(req.body);
    const savedFlight = await newFlight.save();
    res.status(201).json(savedFlight);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen des Flugs', error: error.message });
  }
};

// Flug aktualisieren
exports.updateFlight = async (req, res) => {
  try {
    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFlight) {
      return res.status(404).json({ message: 'Flug nicht gefunden' });
    }
    res.status(200).json(updatedFlight);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Aktualisieren des Flugs', error: error.message });
  }
};

// Flug löschen
exports.deleteFlight = async (req, res) => {
  try {
    const deletedFlight = await Flight.findByIdAndDelete(req.params.id);
    if (!deletedFlight) {
      return res.status(404).json({ message: 'Flug nicht gefunden' });
    }
    res.status(200).json({ message: 'Flug erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Flugs', error: error.message });
  }
};
