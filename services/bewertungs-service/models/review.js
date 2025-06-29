const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productID: {        // ID des Produkts, auf das sich die Bewertung bezieht
    type: String,     // String-Typ für die Produkt-ID
    required: true,   // Pflichtfeld
    trim: true        // Entfernt Leerzeichen am Anfang und Ende
  },
  nameRezensent: {
    type: String,
    required: true,
    trim: true
  },
  titel: {
    type: String,
    required: true,
    trim: true
  },
  beschreibung: {
    type: String,
    required: true
  },
  sterne: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  dienstleistungsTyp: {
    type: String,
    required: true,
    enum: ['hotel', 'flug', 'mietwagen']
  },
  datum: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
