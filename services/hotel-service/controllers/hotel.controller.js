const Hotel = require('../models/hotel');

// Alle Hotels abrufen
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Hotels', error: error.message });
  }
};

// Ein einzelnes Hotel abrufen
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel nicht gefunden' });
    }
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Hotels', error: error.message });
  }
};

// Neues Hotel erstellen
exports.createHotel = async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen des Hotels', error: error.message });
  }
};

// Hotel aktualisieren
exports.updateHotel = async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedHotel) {
      return res.status(404).json({ message: 'Hotel nicht gefunden' });
    }
    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Aktualisieren des Hotels', error: error.message });
  }
};

// Hotel löschen
exports.deleteHotel = async (req, res) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) {
      return res.status(404).json({ message: 'Hotel nicht gefunden' });
    }
    res.status(200).json({ message: 'Hotel erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Hotels', error: error.message });
  }
};
