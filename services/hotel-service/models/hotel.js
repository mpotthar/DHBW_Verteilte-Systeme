const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ort: {
    type: String,
    required: true,
    trim: true
  },
  sterne: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  zimmerzahl: {
    type: Number,
    required: true,
    min: 1
  },
  preis: {
    type: Number,
    required: true,
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
  timestamps: true 
});

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
