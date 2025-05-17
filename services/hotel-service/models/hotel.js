const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name ist erforderlich'],
    trim: true
  },
  ort: {
    type: String,
    required: [true, 'Ort ist erforderlich'],
    trim: true
  },
  sterne: {
    type: Number,
    required: [true, 'Sterne-Bewertung ist erforderlich'],
    min: 1,
    max: 5
  },
  zimmerzahl: {
    type: Number,
    required: [true, 'Zimmerzahl ist erforderlich'],
    min: 1
  },
  preis: {
    type: Number,
    required: [true, 'Preis pro Nacht ist erforderlich'],
    min: 0
  },
  beschreibung: {
    type: String,
    trim: true
  },
  bilder: [{
    type: String,
    trim: true
  }],
  verfuegbar: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // createdAt, updatedAt automatisch hinzufügen
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
