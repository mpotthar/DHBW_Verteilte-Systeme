const Review = require('../models/review');

// Alle Bewertungen abrufen
exports.getAllReviews = async (req, res) => {
    try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Bewertungen', error: error.message });
  }
};

// Bewertungen nach Produkt-ID abrufen
// Abweichung zu anderen Microservices: Hier wird die Produkt-ID als Parameter erwartet
exports.getReviewsByProductId = async (req, res) => {
  try {
    const reviews = await Review.find({ productID: req.params.productId });
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Keine Bewertungen für dieses Produkt gefunden' });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Bewertungen', error: error.message });
  }
};

// Eine einzelne Bewertung abrufen
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Bewertung nicht gefunden' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Bewertung', error: error.message });
  }
};

// Neue Bewertung erstellen
exports.createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen der Bewertung', error: error.message });
  }
};

// Bewertung aktualisieren
exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Bewertung nicht gefunden' });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Aktualisieren der Bewertung', error: error.message });
  }
};

// Bewertung löschen
exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Bewertung nicht gefunden' });
    }
    res.status(200).json({ message: 'Bewertung erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen der Bewertung', error: error.message });
  }
};
