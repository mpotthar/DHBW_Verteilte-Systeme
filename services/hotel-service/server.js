const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./config/db');

// Express App initialisieren
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Datenbank verbinden
db.connect();

// Routen
const hotelRoutes = require('./routes/hotel.routes');
app.use('/api/hotels', hotelRoutes);

// Basis-Route
app.get('/', (req, res) => {
  res.json({ message: 'Willkommen beim Hotel-Service der Mein-Urlaub-App' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Hotel-Service läuft auf Port ${PORT}`);
});

// Frontend Kommunikation
app.use(cors({
    origin: ['*'], // URLs des Admin-Frontends
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
