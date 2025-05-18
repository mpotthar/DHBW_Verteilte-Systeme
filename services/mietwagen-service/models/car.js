const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  typ: {
    type: String,
    required: true,
    trim: true
  },
  hersteller: {
    type: String,
    required: true,
    trim: true
  },
  modell: {
    type: String,
    required: true,
    trim: true
  },
  sitzplaetze: {
    type: Number,
    required: true,
    min: 1
  },
  getriebe: {
    type: String,
    required: true,
    enum: ['Automatik', 'Manuell']
  },
  versicherung: {
    type: String,
    required: true,
    trim: true
  },
  mietpreis_pro_24h: {
    type: Number,
    required: true,
    min: 0
  },
  bild_url: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
