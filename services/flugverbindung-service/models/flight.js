const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  start: { 
    type: String, 
    required: true, 
    trim: true 
  },
  ziel: { 
    type: String, 
    required: true, 
    trim: true 
  },
  abflug: { 
    type: Date, 
    required: true 
  },
  ankunft: { 
    type: Date, 
    required: true 
  },
  fluggesellschaft: { 
    type: String, 
    required: true, 
    trim: true 
  },
  flugnummer: { 
    type: String, 
    required: true, 
    trim: true 
  },
  preis: { 
    type: Number, 
    required: true, 
    min: 0 
  }
}, {
  timestamps: true
});

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
